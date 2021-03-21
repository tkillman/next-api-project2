import { Resolver, Query, Arg } from 'type-graphql';
import { getExecSelectResult } from '~/utils/mybatisUtils';
import { IDBRequest } from '~/types/IDbDeclares';
import { ENTITY_adm0020_RESULT } from '../../entity/adm0020/ENTITY_adm0020';

@Resolver()
export default class adm0020Resolver {
	@Query(() => ENTITY_adm0020_RESULT, {
		description: '영업일보 오더 조회'
	})
	public async adm0020GetOrderList(
		@Arg('NAME', { nullable: true }) NAME: string = ''
	): Promise<ENTITY_adm0020_RESULT> {
		let result: ENTITY_adm0020_RESULT;

		// args set
		const args: IDBRequest = {
			queryParams: {
				namespace: 'adm0020.adm0020',
				sqlId: 'adm0020GetOrderList',
				params: {
					NAME
				}
			}
		};

		// query exec
		try {
			result = await getExecSelectResult(args);
		} catch (ex) {
			return (result = ex);
		}
		return result;
	}
}
