import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly client: Anthropic;

  constructor(private readonly configService: ConfigService) {
    this.client = new Anthropic({
      apiKey: this.configService.get<string>('ANTHROPIC_API_KEY'),
    });
  }

  async chat(userId: string, message: string, language: 'en' | 'sw'): Promise<string> {
    const systemPrompt =
      'You are Angaza\'s agricultural trade advisor. You help harvesters and buyers of baobab, tamarind, and wild cotton in Kenya. ' +
      'Answer in the user\'s language (Swahili or English). ' +
      'You know about harvesting seasons, quality standards, pricing, collection points in Makueni County, and export requirements. ' +
      'Be concise, practical, and supportive of smallholder farmers and rural buyers.';

    this.logger.debug(`AI chat request from user ${userId}, language: ${language}`);

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const block = response.content[0];
    if (block.type !== 'text') {
      throw new Error('Unexpected response type from AI service');
    }

    return block.text;
  }
}
