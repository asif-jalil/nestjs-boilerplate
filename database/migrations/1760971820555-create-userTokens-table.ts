import { type MigrationInterface, type QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateUserTokensTable1760971820555 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "userTokens",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
            isNullable: false,
            isArray: false,
            zerofill: false,
            unsigned: true
          },
          {
            name: "userId",
            type: "int",
            isNullable: false,
            unsigned: true
          },
          {
            name: "email",
            type: "varchar",
            length: "100",
            isNullable: true
          },
          {
            name: "purpose",
            type: "varchar",
            length: "50",
            isNullable: false
          },
          {
            name: "token",
            type: "varchar",
            length: "36",
            isNullable: false
          },
          {
            name: "sendCount",
            type: "int",
            isNullable: false,
            default: 1
          },
          {
            name: "createdAt",
            type: "datetime",
            isNullable: false,
            default: "CURRENT_TIMESTAMP"
          },
          {
            name: "updatedAt",
            type: "datetime",
            isNullable: false,
            default: "CURRENT_TIMESTAMP"
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "userTokens",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createIndex(
      "userTokens",
      new TableIndex({
        name: "IDX_USERID_PURPOSE",
        columnNames: ["userId", "purpose"],
        isUnique: true
      })
    );

    await queryRunner.createIndex(
      "userTokens",
      new TableIndex({
        name: "IDX_PURPOSE_TOKEN",
        columnNames: ["purpose", "token"],
        isUnique: true
      })
    );

    await queryRunner.createIndex(
      "userTokens",
      new TableIndex({
        name: "IDX_PURPOSE_EMAIL",
        columnNames: ["purpose", "email"],
        isUnique: true
      })
    );

    await queryRunner.createIndex(
      "userTokens",
      new TableIndex({
        name: "IDX_CREATED_AT",
        columnNames: ["createdAt"]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("userTokens");
  }
}
