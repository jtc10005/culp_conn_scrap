import { LifeEvent, Family } from '@/lib/types';
import Link from 'next/link';

const eventTypeEmojis: Record<LifeEvent['type'], string> = {
  birth: '👶',
  death: '✝️',
  burial: '⚰️',
  baptism: '💧',
  residence: '🏠',
  occupation: '💼',
  immigration: '🚢',
  military: '🎖️',
  other: '📝',
};

const eventTypeLabels: Record<LifeEvent['type'], string> = {
  birth: 'Birth',
  death: 'Death',
  burial: 'Burial',
  baptism: 'Baptism',
  residence: 'Residence',
  occupation: 'Occupation',
  immigration: 'Immigration',
  military: 'Military Service',
  other: 'Event',
};

interface TimelineProps {
  events: LifeEvent[];
  families: Family[];
}

export default function Timeline({ events, families }: TimelineProps) {
  if (events.length === 0 && families.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Timeline</h2>

      {/* Life Events */}
      {events.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-3 text-gray-700 dark:text-gray-300">Life Events</h3>
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="text-2xl flex-shrink-0">{eventTypeEmojis[event.type]}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {eventTypeLabels[event.type]}
                    </span>
                    {event.date && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">{event.date}</span>
                    )}
                  </div>
                  {event.place && (
                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                      📍 {event.place}
                    </div>
                  )}
                  {event.description && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {event.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Families/Marriages */}
      {families.length > 0 && (
        <div>
          <h3 className="text-xl font-medium mb-3 text-gray-700 dark:text-gray-300">
            {families.length === 1 ? 'Family' : 'Families'}
          </h3>
          <div className="space-y-4">
            {families.map((family, index) => (
              <div
                key={family.id}
                className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">💑</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {families.length > 1 ? `Marriage ${index + 1}` : 'Marriage'}
                  </span>
                </div>

                {/* Spouse */}
                {(family.spouse || family.spouseName) && (
                  <div className="mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Spouse: </span>
                    {family.spouse ? (
                      <Link
                        href={`/person/${family.spouse.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {family.spouse.name}
                      </Link>
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300">{family.spouseName}</span>
                    )}
                  </div>
                )}

                {/* Marriage Details */}
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {family.marriageDate && (
                    <div>
                      📅 Married: {family.marriageDate}
                      {family.marriagePlace && ` at ${family.marriagePlace}`}
                    </div>
                  )}
                  {family.divorceDate && (
                    <div className="text-red-600 dark:text-red-400">
                      ⚠️ Divorced: {family.divorceDate}
                    </div>
                  )}
                </div>

                {/* Children */}
                {family.children.length > 0 && (
                  <div className="mt-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Children ({family.children.length}):
                    </span>
                    <ul className="mt-1 ml-6 space-y-1">
                      {family.children.map((child) => (
                        <li key={child.id} className="text-sm">
                          <Link
                            href={`/person/${child.id}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
