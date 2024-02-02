import type { ColumnDataType, ColumnBaseConfig } from 'drizzle-orm';
import type {
	SQLiteColumn,
	SQLiteInsertValue,
	SQLiteTableWithColumns,
} from 'drizzle-orm/sqlite-core';
import type { DBField, FieldsConfig, MaybeArray, MaybePromise } from '../core/types.js';
import type { SqliteDB } from './index.js';

type GeneratedConfig<T extends ColumnDataType = ColumnDataType> = Pick<
	ColumnBaseConfig<T, string>,
	'name' | 'tableName' | 'notNull' | 'hasDefault'
>;

export type AstroText<T extends GeneratedConfig<'string'>> = SQLiteColumn<
	T & {
		data: string;
		dataType: 'string';
		columnType: 'SQLiteText';
		driverParam: string;
		enumValues: never;
		baseColumn: never;
	}
>;

export type AstroDate<T extends GeneratedConfig<'custom'>> = SQLiteColumn<
	T & {
		data: Date;
		dataType: 'custom';
		columnType: 'SQLiteCustomColumn';
		driverParam: string;
		enumValues: never;
		baseColumn: never;
	}
>;

export type AstroBoolean<T extends GeneratedConfig<'boolean'>> = SQLiteColumn<
	T & {
		data: boolean;
		dataType: 'boolean';
		columnType: 'SQLiteBoolean';
		driverParam: number;
		enumValues: never;
		baseColumn: never;
	}
>;

export type AstroNumber<T extends GeneratedConfig<'number'>> = SQLiteColumn<
	T & {
		data: number;
		dataType: 'number';
		columnType: 'SQLiteInteger';
		driverParam: number;
		enumValues: never;
		baseColumn: never;
	}
>;

export type AstroJson<T extends GeneratedConfig<'custom'>> = SQLiteColumn<
	T & {
		data: unknown;
		dataType: 'custom';
		columnType: 'SQLiteCustomColumn';
		driverParam: string;
		enumValues: never;
		baseColumn: never;
	}
>;

export type Column<T extends DBField['type'], S extends GeneratedConfig> = T extends 'boolean'
	? AstroBoolean<S>
	: T extends 'number'
		? AstroNumber<S>
		: T extends 'text'
			? AstroText<S>
			: T extends 'date'
				? AstroDate<S>
				: T extends 'json'
					? AstroJson<S>
					: never;

export type Table<
	TTableName extends string,
	TFields extends Record<string, Pick<DBField, 'type' | 'default' | 'optional'>>,
> = SQLiteTableWithColumns<{
	name: TTableName;
	schema: undefined;
	dialect: 'sqlite';
	columns: {
		[K in Extract<keyof TFields, string>]: Column<
			TFields[K]['type'],
			{
				tableName: TTableName;
				name: K;
				hasDefault: TFields[K] extends { default: NonNullable<unknown> }
					? true
					: TFields[K] extends { primaryKey: true }
						? true
						: false;
				notNull: TFields[K]['optional'] extends true ? false : true;
			}
		>;
	};
}>;
