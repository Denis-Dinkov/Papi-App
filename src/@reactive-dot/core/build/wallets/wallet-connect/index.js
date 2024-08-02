import { ReDotError } from "../../errors.js";
import { DeepLinkWallet } from "../deep-link.js";
import { getPolkadotSignerFromPjs } from "./from-pjs-account.js";
import { BehaviorSubject, lastValueFrom } from "rxjs";
import { map } from "rxjs/operators";
export class WalletConnect extends DeepLinkWallet {
    #providerOptions;
    #provider;
    #modal;
    #modalOptions;
    #chainIds;
    #optionalChainIds;
    #session = new BehaviorSubject(undefined);
    #requestId = 0;
    id = "wallet-connect";
    name = "WalletConnect";
    constructor(options) {
        super(undefined);
        this.#providerOptions =
            options.projectId === undefined
                ? options.providerOptions
                : { ...options.providerOptions, projectId: options.projectId };
        this.#modalOptions = {
            ...(options.modalOptions ?? {}),
            projectId: options.projectId,
        };
        this.#chainIds = options.chainIds;
        this.#optionalChainIds = options.optionalChainIds ?? [];
    }
    async initialize() {
        const { UniversalProvider } = await import("@walletconnect/universal-provider");
        this.#provider ??= await UniversalProvider.init(this.#providerOptions);
        if (this.#provider.session !== undefined) {
            return this.#session.next(this.#provider.session);
        }
    }
    connected$ = this.#session.pipe(map((session) => session !== undefined));
    async initiateConnectionHandshake() {
        await this.initialize();
        if (this.#provider?.client === undefined) {
            throw new ReDotError("Wallet connect provider doesn't have any client");
        }
        const connectOptions = {
            requiredNamespaces: {
                polkadot: {
                    methods: ["polkadot_signTransaction", "polkadot_signMessage"],
                    chains: this.#chainIds,
                    events: ['chainChanged", "accountsChanged'],
                },
            },
        };
        if (this.#optionalChainIds.length > 0) {
            connectOptions.optionalNamespaces = {
                polkadot: {
                    methods: ["polkadot_signTransaction", "polkadot_signMessage"],
                    chains: this.#optionalChainIds,
                    events: ['chainChanged", "accountsChanged'],
                },
            };
        }
        const { uri, approval } = await this.#provider.client.connect(connectOptions);
        if (uri === undefined) {
            throw new ReDotError("No URI provided by connection");
        }
        return {
            uri,
            settled: approval().then((session) => {
                this.#session.next(session);
                // TODO: only happen after connect, not reconnect
                // report this to WalletConnect
                if (this.#provider) {
                    this.#provider.session = session;
                }
            }),
        };
    }
    async connect() {
        const { uri, settled } = await this.initiateConnectionHandshake();
        const connectedPromise = settled.then(() => true);
        const modal = await this.#getModal();
        await modal.openModal({ uri });
        const modalClosePromise = new Promise((resolve) => {
            const unsubscribe = modal.subscribeModal((modalState) => {
                if (!modalState.open) {
                    resolve(false);
                    unsubscribe();
                }
            });
        });
        const connected = await Promise.race([connectedPromise, modalClosePromise]);
        if (!connected) {
            throw new ReDotError("Modal was closed");
        }
        modal.closeModal();
    }
    async disconnect() {
        await this.#provider?.disconnect();
        this.#session.next(undefined);
    }
    accounts$ = this.#session.pipe(map((session) => {
        if (session === undefined) {
            return [];
        }
        return Object.values(session.namespaces)
            .flatMap((namespace) => namespace.accounts)
            .map((account) => account.split(":"))
            .map(([chainType, chainId, address]) => ({
            address,
            genesisHash: chainId,
            polkadotSigner: getPolkadotSignerFromPjs(address, (payload) => this.#provider.client.request({
                topic: session.topic,
                chainId: `${chainType}:${chainId}`,
                request: {
                    method: "polkadot_signTransaction",
                    params: {
                        address: payload.address,
                        transactionPayload: payload,
                    },
                },
            }), async (payload) => {
                const { signature } = await this.#provider.client.request({
                    topic: session.topic,
                    chainId: `${chainType}:${chainId}`,
                    request: {
                        method: "polkadot_signMessage",
                        params: { address: payload.address, message: payload.data },
                    },
                });
                return { id: this.#requestId++, signature };
            }),
        }));
    }));
    getAccounts() {
        return lastValueFrom(this.accounts$);
    }
    async #getModal() {
        if (this.#modal !== undefined) {
            return this.#modal;
        }
        const { WalletConnectModal } = await import("@walletconnect/modal");
        this.#modal = new WalletConnectModal(this.#modalOptions);
        return this.#modal;
    }
}
