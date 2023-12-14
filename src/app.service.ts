import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  appHealth(): object {
    return {
      appName: "Empro Backend",
      version: "1.0.0",
      message: "The application is healthy"
    }
  }
}
