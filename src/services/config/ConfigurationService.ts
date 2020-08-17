import { Configuration } from "@/base/config/Configuration.ts";

export default class ConfigurationService {

    static readonly KEY_NAME = 'configuration';

    public static load(): Configuration {
        const config = new Configuration();
        const json = localStorage.getItem(this.KEY_NAME);

        if (json) {
            const localConfig = JSON.parse(json);
            if (localConfig instanceof Object) {
                config.load(localConfig);
            }
        }

        return config;
    }

    public static persist(config: Configuration): void {
        localStorage.setItem(this.KEY_NAME, config.toJson());
    }
}