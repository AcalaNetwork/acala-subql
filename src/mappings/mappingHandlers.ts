import { SubstrateEvent } from '@subql/types'
import { createEvent } from '../handlers';

export async function handleEvent(event: SubstrateEvent): Promise<void> {
    await createEvent(event)
}
