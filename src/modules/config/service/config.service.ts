import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable, Inject } from '@nestjs/common';


@Injectable()
export class ConfigService {
    private readonly envConfig: Record<string, any>;

    constructor(@Inject('CONFIG_OPTIONS') private options: Record<string, any>) {
        const filePath = `${process.env.NODE_ENV || 'development'}.env`;
        const envFile = path.resolve(__dirname, '../../', options.folder, filePath);
        this.envConfig = dotenv.parse(fs.readFileSync(envFile));
    }

    get(key: string): string {
        return this.envConfig[key];
    }
}
