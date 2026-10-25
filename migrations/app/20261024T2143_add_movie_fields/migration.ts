#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/6085dfbbe6c5faf94812ffe00f9feb229aacd1c397b9e3d1797688c52b4271be/contract';
import endContract from '../../snapshots/6085dfbbe6c5faf94812ffe00f9feb229aacd1c397b9e3d1797688c52b4271be/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/d10b4ef5586cbb73255a3f627e97e64bd349edd54cf889bc6273a1f40eb84d86/contract';
import startContract from '../../snapshots/d10b4ef5586cbb73255a3f627e97e64bd349edd54cf889bc6273a1f40eb84d86/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'collection', column: 'wayched_at' }),
      this.dropColumn({ schema: 'public', table: 'users', column: 'creates_at' }),
      this.addColumn({
        schema: 'public',
        table: 'collection',
        column: col('watched_at', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'movies',
        column: col('vote_average', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'users',
        column: col('created_at', 'timestamptz', {
          notNull: true,
          default: fn('now()'),
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
