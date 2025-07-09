import { AbilityBuilder, createMongoAbility } from '@casl/ability'

const { can, build } = new AbilityBuilder(createMongoAbility);
can('read', 'Expedition');


const ability = build();
export default ability;