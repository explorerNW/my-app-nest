import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigModuleOptions, MODULE_OPTIONS_TOKEN } from '../config.module-definition';

@Injectable()
export class ConfigService {
    private readonly envConfig: Record<string, any>;

    constructor(@Inject(MODULE_OPTIONS_TOKEN) private options: ConfigModuleOptions) {
        const filePath = `${process.env.NODE_ENV || 'development'}.env`;
        const envFile = path.resolve(__dirname, '../../../../', this.options.folder, filePath);
        this.envConfig = dotenv.parse(fs.readFileSync(envFile));
    }

    get(key: string): string {
        return this.envConfig[key];
    }
}
