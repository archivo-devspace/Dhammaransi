import notifee, { AndroidImportance } from '@notifee/react-native';

interface Notification {
    title : string,
    body: string,
    channelId : string
}

interface CreateChannel{
    channelId : string,
    channelName : string
}

export const displayNotification = async({title,body,channelId}:Notification) =>  {

  await notifee.displayNotification({
    title: title,
    body: body,
    android: {
      channelId: channelId,
      smallIcon: 'ic_notification', 
      pressAction: {
        id: 'default',
      },
    },
  });
}


export const createChannel = async({channelId,channelName}:CreateChannel) =>  {
  const createdChannel = await notifee.createChannel({
    id: channelId,
    name: channelName,
    importance: AndroidImportance.HIGH,
  });
  return channelId;
}
