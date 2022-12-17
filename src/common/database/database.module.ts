import { Global, Logger, Module } from '@nestjs/common';
import dataSource from 'ormconfig';
import { DataSource } from 'typeorm';

@Global()
@Module({
  providers: [
    {
      provide: DataSource,
      useFactory: async () => {
        try {
          await dataSource.initialize();
          Logger.log('Data source initialized');
          return dataSource;
        } catch (e) {
          console.log('err ', e);
          throw new Error('Error in DB Initialization');
        }
      }
    }

  ],
  exports: [DataSource]
})
export class DatabaseModule {
}
