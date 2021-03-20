import { ObjectType, Field, ClassType } from 'type-graphql';

/** OUT_RESULT 가 존재하는경우 아래 엔티티를 사용 */
export default function ENTITY_RESULT_OUT<TItem>(
	TItemClass: ClassType<TItem>,
	ResolverName?: string
) {
	// 제레릭 타입의 RESULT
	@ObjectType(
		`${TItemClass.name}${ResolverName&& '_' + ResolverName!}_RESULT`
	)
	abstract class ENTITY_RESULT_OUT_CLASS {
		@Field()
		public OUT_RET_CODE: string;

		@Field()
		public OUT_RET_MSG: string;

		@Field(type => [TItemClass], { nullable: true })
		public OUT_RESULT?: TItem[];
	}
	return ENTITY_RESULT_OUT_CLASS;
}
