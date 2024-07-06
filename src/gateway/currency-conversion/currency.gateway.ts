import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CurrencyGateway {
  private apiUrl: string;
  private apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('EXCHANGE_RATE_API_URL');
    this.apiKey = this.configService.get<string>('EXCHANGE_RATE_API_KEY');
  }

  async getExchangeRate(from: string, to: string): Promise<number> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.apiUrl}/${this.apiKey}/pair/${from}/${to}`,
        ),
      );

      if (response.data && response.data.conversion_rate) {
        return response.data.conversion_rate;
      } else {
        return 1; // Default to 1 if the conversion rate is not available
      }
    } catch (error) {
      return 1; // Default to 1 if an error occurs
    }
  }
}
