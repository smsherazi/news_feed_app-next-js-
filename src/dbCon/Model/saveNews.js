const { default: mongoose } = require("mongoose");

const savedNewsModel = mongoose.Schema({
    savedNewsId:{
    type: String,
    required: true
    },
      userId: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  pubDate: {
    type: String
  },

  source_id: {
    type: String
  },

  source_name: {
    type: String
  },

  source_icon: {
    type: String
  },

  image_url: {
    type: String
  },

  creator: {
    type: [String]
  },

  savedAt: {
    type: Date,
    default: Date.now
  }
})
export const SavedNews = mongoose.models.saved_news || mongoose.model("saved_news",savedNewsModel);