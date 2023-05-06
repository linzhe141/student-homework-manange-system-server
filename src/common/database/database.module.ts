import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MYSQLCONFIG } from '@/config/db.comfig';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...MYSQLCONFIG,
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
