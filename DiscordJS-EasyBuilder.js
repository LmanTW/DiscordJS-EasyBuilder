class Page {
  #content = {
    content: undefined,
    files: [],
    embeds: [],
    components: []
  }
  #callback = {}
  #data

  constructor (data) {
    this.#data = data
  }

  get content () {return this.#content}

  /**
    ## 設定內容
    ```js
      Page.setContent(content)
    ```
    - `content <string>`｜訊息的內容
  */
  setContent (content) {
    this.#content = content
    return this
  }

  /**
    ## 添加等案
    ```js
      Page.addFile(file)
    ```
    - `file <string>`｜檔案的路徑
  */
  addFile (file) {
    this.#content.files.push(file)
    return this
  }

  /**
    ## 設定 Embed
    ```js
      Page.setEmbed(data)
    ```
    - `data <object>`
    ```js
      {
        color: 'green',
        title: 'Embed Example',
        url: 'https://google.com',
        image: undefined,
        fields: {
          { inline: true, name: 'My Name Is:', value: 'LmanTW' }
        }
        footer: { text: 'Hello Here' }
      }
    ```
  */
  setEmbed (data) {
    this.#content.embeds = [{
      color: colors[data.color],
      title: data.title,
      url: data.url,
      files: data.files,
      image: data.image,
      fields: data.fields,
      footer: data.footer
    }]
    return this
  }

  /**
    ## 添加按鈕
    ```js
      Page.addButton(data, callback)
    ```
    - `data <object>`
    ```js
      {
        style: 'link' //green, blue, red, gray, link
        label: 'A Button'
        emoji: '👍'
        url: 'https://google.com' //只有 style 為 "link" 時才會生效
      }
    ```
    - `callback <function>`｜按鈕觸發時回傳的函數，會包含一個 interaction，只有在 只有 style 為 "link" 時才會生效
  */
  addButton (data, callback) {
    if (this.#content.components.length === 0 || this.#content.components[this.#content.components.length-1].components.length > 4 || (this.#content.components[this.#content.components.length-1].components[0] !== undefined && this.#content.components[this.#content.components.length-1].components[0].type === 3)) this.#content.components.push({ type: 1, components: [] })
    let id = (data.customID === undefined) ? generateID(Object.keys(this.#callback)) : data.customID
    this.#content.components[this.#content.components.length-1].components.push({
      type: 2,
      custom_id: (data.style === 'link') ? undefined : id,
      style: [1, 2, 3, 4, 5][['blue', 'gray', 'green', 'red', 'link'].indexOf(data.style)],
      label: data.label,
      emoji: data.emoji,
      url: (data.style === 'link') ? data.url : undefined 
    })
    if (data.style !== 'link') this.#callback[id] = callback
    return this
  }

  /**
    ## 添加選單
    ```js
      Page.addSelectMenu(data, callback)
    ```
    - `data <object>`
    ```js
      {
        placeholder: '未選取',
        options: [
          { label: '選項1', value: '1' },
          { label: '選項2', value: '2' },
          { label: '選項3', value: '3' }
        ]
      }
    ```
    - `callback <function>`｜選單觸發時回傳的函數，會包含一個 interaction
  */
  addSelectMenu (data, callback) {
    this.#content.components.push({ type: 1, components: [] })
    let id = (data.customID === undefined) ? generateID(Object.keys(this.#callback)) : data.customID
    this.#content.components[this.#content.components.length-1].components.push({
      type: 3,
      custom_id: id,
      placeholder: data.placeholder,
      options: data.options
    })
    this.#callback[id] = callback
    return this
  }

  /**
    ## 添加行
    ```js
      Page.addRow()
    ```
  */
  addRow () {
    this.#content.components.push({ type: 1, components: [] })
    return this
  }

  /**
    ## 收集交互
    ```js
      Page.collect(target, interaction, options)
    ```
    - `target <any>`｜一個 message 或 interaction
    - `interaction <any>`｜一個 interaction (如果 target 為 interaction 就不必提供)
    - `options <object>`｜**可以不提供**
    ```js
      {
        filter, //一個返回 <boolean> 的 <function>
        collect //收集的時間
      }
    ```
  */
  async collect (target, interaction, options) {
    let type = (target.author === undefined) ? 'interaction' : 'message'
    try {
      if (type === 'interaction') await target.update()
      else await interaction.update()
    } catch (error) {}
    if (options === undefined) {
      options = { 
        filter: async (e) => {
          if (type === 'interaction') {
            if (e.user.id === target.user.id && Object.keys(this.#callback).includes(e.customId)) return true
            else return false
          } else {
            if (e.user.id === target.interaction.user.id && Object.keys(this.#callback).includes(e.customId)) return true
            else return false
          }
        },
        time: 600000, 
      }
    }
    const collector = target.channel.createMessageComponentCollector(options)
    collector.on('collect', async (i) => {
      collector.removeAllListeners('collect')
      if (typeof this.#callback[i.customId] === 'function') this.#callback[i.customId](i)
    })
    return target
  }
}

class Modal {
  #id = `Modal.${generateID([])}`
  #title
  #components = []

  constructor (title) {
    this.#title = title
  }
  
  /**
    ## 添加文字輸入
    ```js
      Modal.addTextInput(data)
    ```
    - `data <object>`
    ```js
      {
        customID: 'password',
        style: 'short', //short, paragraph
        label: '密碼',
        value: 'WiBn125',
        minLength: 5,
        maxLength: 25,
        placeholder: '未輸入'
      }
    ```
  */
  addTextInput (data) {
    this.#components.push({
      type: 1,
      components: [{
        type: 4,
        custom_id: data.customID,
        style: [1, 2][['short', 'paragraph'].indexOf(data.style)],
        label: data.label,
        value: data.value,
        min_length: data.minLength,
        max_length: data.maxLength,
        placeholder: data.placeholder,
      }]
    })
    return this
  }

  /**
    ## 顯示 Modal
    ```js
      Modal.showModal(interaction, callback, options)
    ```
    - `interaction <any>`｜一個 interaction
    - `callback <function>`｜用戶提交 Modal 後觸發的函數
    - `options <object>`｜**可以不提供**
    ```js
      {
        filter, //一個返回 <boolean> 的 <function>
        collect //收集的時間
      }
    ```
  */
  async showModal (interaction, callback, options) {
    interaction.showModal({
      custom_id: this.#id,
      title: this.#title,
      components: this.#components
    })
    if (options === undefined) {
      options = {
        filter: i => i.user.id === interaction.user.id && i.customId === this.#id, 
        time: 600000,
        max: 1
      }
    }
    interaction.awaitModalSubmit(options)
      .then(async (i) => {
        let allInput = {}
        this.#components.forEach((item) => allInput[item.components[0].custom_id] = i.fields.getTextInputValue(item.components[0].custom_id))
        try {
          await i.update()
        } catch (error) {}
        callback(allInput)
      })
  }
}

module.exports = { Page, Modal }

//顏色
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

const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'

//取得隨機數
function getRandom (min, max) {
  return Math.floor(Math.random()*max)+min
}

//生成ID
function generateID (keys) {
  let string = `${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}`
  while (keys.includes(string)) string = `${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}${letters[getRandom(0, letters.length)]}`
  return string
}
