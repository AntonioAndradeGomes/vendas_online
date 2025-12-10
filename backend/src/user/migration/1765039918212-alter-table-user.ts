import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableUserEmail1709609486023 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE public.user ADD CONSTRAINT unique_email UNIQUE (email);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE public.user DROP CONSTRAINT unique_email;
        `);
    }
}
