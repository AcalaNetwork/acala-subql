import type { EventRecord } from '@polkadot/types/interfaces'

export const findEvent = (events: EventRecord[], section: string, method: string, ) => {
    return events.find(({ event }) => event.section === section && event.method === method)
}