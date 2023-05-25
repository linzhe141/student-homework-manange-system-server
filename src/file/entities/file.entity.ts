import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  originalname: string;

  @Column({ type: 'varchar' })
  serverFileName: string;

  @Column({ type: 'varchar' })
  path: string;

  @Column({ type: 'varchar' })
  serverPath: string;

  @CreateDateColumn()
  create_time: Date;

  @UpdateDateColumn()
  update_time: Date;
}
