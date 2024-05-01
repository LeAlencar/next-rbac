import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'
import { z } from 'zod'

import { billingSubject } from './models/subjects/billing'
import { inviteSubject } from './models/subjects/invite'
import { organizationSubject } from './models/subjects/organization'
import { projectSubject } from './models/subjects/project'
import { userSubject } from './models/subjects/user'
import { User } from './models/user'
import { permissions } from './permissions'

const AppAbilitiesSchema = z.union([
  projectSubject,
  userSubject,
  billingSubject,
  inviteSubject,
  organizationSubject,
  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof AppAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Undefined permissions for role ${user.role}`)
  }

  permissions[user.role](user, builder)
  const ability = builder.build()
  return ability
}
