using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PushNotificationDotNetCore.Models
{
    public class NotificationModel
    {
        public string Title { get; set; }
        public string Message { get; set; }
        public string Url { get; set; }
    }
}
