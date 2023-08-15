class Page {
  #callback = {}
  constructor () {
    this.content = undefined
    this.embeds = []
    this.components = []
    this._idUsed = []
  }
  //設定內容
  setContent (data) {
    this.content = data
    return this
  }
  //設定Embed {color, title, url, footer, fields}
  setEmbed (data) {
    this.embeds.push({
      color: colors[data.color],
      title: data.title,
      url: data.url,
      footer: data.footer,
      fields: data.fields
    })
    return this
  }
  //添加按鈕 {customId, label, style, emoji}
  addButton(data, callBack) {
    if (this.components.length === 0 || this.components[this.components.length-1].components.length > 4) {
      this.components.push({
        type: 1,
        components: []
      })
    }
    let id = (data.customId === undefined) ? generateID(this._idUsed) : data.customId
    this._idUsed.push(id)
    if (data.style === 'link') {
      this.components[this.components.length-1].components.push({
        type: 2,
        label: data.label,
        url: data.url,
        style: [1, 2, 3, 4, 5][['blue', 'gray', 'green', 'red', 'link'].indexOf(data.style)],
        emoji: data.emoji
      })
    } else {
      this.components[this.components.length-1].components.push({
        type: 2,
        custom_id: id,
        label: data.label,
        style: [1, 2, 3, 4, 5][['blue', 'gray', 'green', 'red', 'link'].indexOf(data.style)],
        emoji: data.emoji
      })
      this.#callBack[id] = callBack
    }
    return this
  }
  //添加選擇菜單 {placeholder, options}
  addSelectMenu (data, callBack) {
    this.components.push({
      type: 1,
      components: []
    })
    let id = (data.customId === undefined) ? generateID(this._idUsed) : data.customId
    this._idUsed.push(id)
    this.components[this.components.length-1].components.push({
      type: 3,
      custom_id: id,
      placeholder: data.placeholder,
      options: data.options
    })
    this._callBack[id] = callBack
    return this
  }
  //添加行
  addRow () {
    this.components.push({
      type: 1,
      components: []
    })
    return this
  }
  //收集交互
  async collect (target, options) {
    let type = (target.author === undefined) ? 'interaction' : 'message'
    if (options === undefined) {
      options = { 
        filter: (type === 'interaction') ? i => i.user.id === target.user.id && this._idUsed.includes(i.customId) : i => i.user.id === target.interaction.user.id && this._idUsed.includes(i.customId), 
        time: 600000, 
        max: 1 
      }
    }
    const collector = target.channel.createMessageComponentCollector(options)
    collector.on('collect', async i => {
      this._callBack[i.customId](i)
    })
  }
}

class Modal {
  constructor (title) {
    this._customId = `Modal.${generateID([])}`
    this._title = title
    this._components = []
  }
  //添加文字輸入
  addTextInput (data) {
    this._components.push({
      type: 1,
      components: [{
        type: 4,
        custom_id: data.customId,
        label: data.label,
        style: [1, 2][['short', 'paragraph'].indexOf(data.style)],
        min_length: data.minLength,
        max_length: data.maxLength,
        value: data.value,
        placeholder: data.placeholder
      }]
    })
    return this
  }
  //顯示Modal
  showModal (interaction, callback, options) {
    interaction.showModal({
      title: this._title,
      custom_id: this._customId,
      components: this._components
    })
    if (options === undefined) {
      options = {
        filter: i => i.user.id === interaction.user.id && i.customId === this._customId, 
        time: 600000,
        max: 1
      }
    }
    interaction.awaitModalSubmit(options)
      .then(async i => {
        let allInput = {}
        this._components.map((item) => {
          allInput[item.components[0].custom_id] = i.fields.getTextInputValue(item.components[0].custom_id)
        })
        try {
          await i.update()
        } catch (error) {}
        callback(allInput)
      })
  }
}

//內建工具

const letters = 'ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz1234567890'
const colors = {
  black: 2303786,
  white: 16777215,
  gray: 9807270,
  darkGray: 9936031,
  lightGray: 12370112,
  red: 15548997,
  darkRed: 10038562,
  orange: 15105570,
  darkOrange: 11027200,
  yellow: 16705372,
  green: 5763719,
  darkGreen: 2067276,
  blue: 3447003,
  darkBlue: 2123412,
  purple: 10181046,
  darkPurple: 7419530
}

//取得隨機數
function getRandom (min,max) {
  return Math.floor(Math.random()*max)+min
}

//生成ID
function generateID (allKey) {
  let string = `${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}`
  while (allKey.includes(string)) {
    string = `${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}`
  }
  return string
}

module.exports = { Page, Modal }
