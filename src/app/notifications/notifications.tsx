import '@stefanprobst/notifications/notifications.css'
import '@stefanprobst/notifications/notification-message.css'

import {
  Announcer,
  createNotificationsStore,
  createNotify,
  NotificationMessage,
  Notifications as NotificationsList,
  NotificationsProvider,
} from '@stefanprobst/notifications'

const store = createNotificationsStore()

export const notification = createNotify(store)

export function Notifications(): JSX.Element {
  return (
    <NotificationsProvider store={store}>
      {(notifications, store) => {
        return (
          <>
            <NotificationsList notifications={notifications} store={store}>
              {(notification) => {
                return <NotificationMessage notification={notification} store={store} />
              }}
            </NotificationsList>
            <Announcer notifications={notifications} store={store}>
              {(notification) => {
                return <NotificationMessage notification={notification} store={store} />
              }}
            </Announcer>
          </>
        )
      }}
    </NotificationsProvider>
  )
}
