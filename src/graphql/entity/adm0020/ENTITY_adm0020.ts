import { ObjectType, Field } from 'type-graphql';
import ENTITY_RESULT_OUT from '~/entity/common/ENTITY_RESULT_OUT';

// Field() 프로퍼티는 graphQL 에서 리턴되는 필드들
@ObjectType()
export class ENTITY_adm0020 {
	// 리스트
	@Field({nullable: true})
	public PASSWD: string;	

	@Field({nullable: true})
	public NAME: string;	

	@Field({nullable: true})
	public EMAIL: string;	

	@Field({nullable: true})
	public PHONE: number;
	
	@Field({nullable: true})
	public STATUS: string;
}

@ObjectType()
export class ENTITY_adm0020_RESULT extends ENTITY_RESULT_OUT(
	ENTITY_adm0020
) {}
