export interface ConfigurationInterface {
    showSidebar: boolean;
}

export class ConfigurationDto implements ConfigurationInterface {
    showSidebar = true;
}

export class Configuration extends ConfigurationDto {

    constructor(config: ConfigurationDto) {
        super();
        this.load(config);
    }


    public load(config: ConfigurationDto): void {
        Object.assign(this, config);
    }

    public toJson(): string {
        return JSON.stringify(this);
    }
}