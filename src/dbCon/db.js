const {DB_Username,DB_Password} = process.env;



export const ConnectionStr= "mongodb+srv://"+DB_Username+":"+DB_Password+"@firstcluster.pcbyl3g.mongodb.net/news_feed_app?retryWrites=true&w=majority&appName=FirstCluster";