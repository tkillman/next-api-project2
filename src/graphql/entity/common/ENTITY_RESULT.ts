import { ObjectType, Field } from 'type-graphql';

/** OUT_RESULT 가 없는경우 아래 엔티티를 사용 */
@ObjectType()
export class ENTITY_RESULT {
	@Field()
	public OUT_RET_CODE: string;

	@Field()
	public OUT_RET_MSG: string;
}
