import {Strategy, StrategyResult} from '../src/types/Strategy'
import {SchoolStrategy} from '../src/strategies/SchoolStrategy'
import {GenderStrategy} from '../src/strategies/GenderStrategy'

import {depends} from '../src/shinichi/compose'
import {Person} from '../src/types/Person'
import {Shinichi} from '../src/shinichi'
import {SchoolMockContext} from './mocks/SchoolMock'
import {expectUsername} from './utils/Expect'

const CombinedStrategy: Strategy = async (person, state, ctx): Promise<StrategyResult | undefined> => {
  await depends([SchoolStrategy, GenderStrategy], person, state, ctx)

  // If the dependencies are not satisfied, abort.
  if (!person.gender || !person.school) return

  person.Facebook = {
    username: 'phoomparin.mano',
    link: 'https://facebook.com/phoomparin.mano'
  }

  return {person, state}
}

describe('Strategy Composition', () => {
  it('should be able to compose strategies', async () => {
    const target: Person = {
      title: 'Mr.',
      firstName: 'Phoomparin',
      lastName: 'Mano'
    }

    const shin = new Shinichi()
    shin.context = SchoolMockContext
    shin.strategyMap.Facebook = CombinedStrategy

    shin.want('Facebook')

    const {person} = await shin.searchFor(target)
    expectUsername(person.Facebook).toBe('phoomparin.mano')
  })
})