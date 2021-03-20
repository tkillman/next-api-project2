import { BIND_OUT, DB_TYPE_VARCHAR, CURSOR } from 'oracledb';

export const getRowCount = 99999;

/**
 * Graphql Resolver 에서 프로시저 호출시 OUT 파라메터 공통 부분 - UPDATE, INSERT 프로시저
 */
export const OUT_COMMON_PARAMS_UPDATE_TYPE = {
	OUT_RET_CODE: {
		dir: BIND_OUT,
		type: DB_TYPE_VARCHAR
	},
	OUT_RET_MSG: {
		dir: BIND_OUT,
		type: DB_TYPE_VARCHAR
	}
};

/**
 * Graphql Resolver 에서 프로시저 호출시 OUT 파라메터 공통 부분 - SELECT 프로시저
 */
export const OUT_COMMON_PARAMS_SELECT_TYPE = {
	...OUT_COMMON_PARAMS_UPDATE_TYPE,
	OUT_RET_CURSOR: {
		dir: BIND_OUT,
		type: CURSOR
	}
};