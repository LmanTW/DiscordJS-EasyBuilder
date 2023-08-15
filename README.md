# DiscordJS-EasyBuilder
DiscordJS-EasyBuilder是一個套件讓你可以簡單的在Discord.JS裡製作"頁面"

# 範例
```js
const { Page } = require('./DiscordJS-EasyBuilder')
let page = new Page()
  .setEmbed({
    color: 'green',
    title: 'Hello World!',
  })
  .addButton({
    label: '點擊我！',
    style: 'blue'
  }, (interaction2) => {
    interaction2.channel.send('按鈕被點擊！')
  })
let message = await page.collect(await interaction.channel.send(page), interaction)
```

# 內容
  * [Page](#page)
    * [setContent()](#setcontent)
    * [setEmbed()](#setembed)
    * [addButton()](#addbutton)
    * [addSelectMenu()](#addselectmenu)
    * [addRow()](#addrow)
    * [collect()](#collect)
  * [Modal](#modal)
    * [addTextInput()](#addtextinput)
    * [showModal()](#showmodal)
  * [Embed顏色](#embed顏色)

# Page 
Page是一個Class，你可以用它來製作"頁面"
```js
const { Page } = require('./DiscordJS-EasyBuilder')
let page = new Page()
```

## setContent()
```js
.setContent(content) //設定內容
```
* `content <string>`｜訊息的內容

## setEmbed()
```js
.setEmbed(data) //設定Embed
```
* `data <object>`｜Embed的資料
```js
//Embed接受的資料
{
  color, //Embed的顏色
  title, //Embed的標題
  url, //Embed的連結
  footer, //Embed的Footer
  fields  //Embed的Fields
}
```
[Embed顏色](#embed顏色)

## addButton()
```js
.addButton(data, callback) //添加Button
```
* `data <object>`｜Button的資料
* `callback <function>`｜Button被點擊後觸發的函數，會帶有一個interaction的參數(`(interaction) => {...}`)他是由collector返回的一個新的interaction
```js
//Button接受的資料
{
  label, //按鈕的標題
  url, //按鈕的連結 (只在style為link時可用)
  style: //按鈕的類型 (blue, green, gray, link])
  emoji: //按鈕的表情符號
}

//範例
page.addButton({
  label: '我是一個按鈕',
  style: 'blue',
}, () => {
  console.log('按鈕被點擊了')
})
page.collect(await interaction.channel.send(page))
```

## addSelectMenu()
```js
.addSelectMenu(data, callback) //添加SelectMenu
```
* `data <object>`｜SelectMenu的資料
* `callback <function>`｜SelectMenu被選取後觸發的函數
```js
//SelectMenu接受的資料
{
  placeholder, //在SelectMenu未被選取任何一項時顯示的文字
  options //SelectMenu的選項
}

//範例
page.addSelectMenu({
  placeholder: '未選取',
  options: [
    //value類似customId，在collect時可用interaction.values[0]來取得選項的value
    { label: '選項1', description: '這是一個選項', value: 'option1' }
    { label: '選項2', description: '這是一個選項', value: 'option2' }
    { label: '選項3', description: '這是一個選項', value: 'option3' }
  ]
}, (interaction2) => {
  console.log(`選項 ${interaction2.values[0]} 被選取了`)
})
page.collect(await interaction.channel.send(page))
```

## addRow()
```js
.addRow() //添加行
```
EasyBuilder會在行滿時自動添加一行，但你也可以透過addRow手動添加行
```js
//範例
page.addButton({
  label: '我是一個按鈕',
  style: 'blue',
})
page.addRow()
page.addButton({
  label: '我是一個按鈕',
  style: 'blue',
})
interaction.channel.send(page)
```

## collect 
```js
await .collect(target, interaction, options) //收集交互
```
* `target`｜可為 Interaction 或 Message
* `interaction`｜可為 Interaction 或不提供，如果不提供按鈕在被出發後可能會出現些 "此互交失敗" 的問題
* `options <object>`｜collector 的選項

```js
//預設的options
{
  filter: (type === 'interaction') ? i => i.user.id === target.user.id && this._idUsed.includes(i.customId) : i => i.user.id === target.interaction.user.id && this._idUsed.includes(i.customId), 
  time: 600000, 
  max: 1 
}
```

# Modal
Modal是一個Class，你可以用它來製作"模態"
```js
const { Modal } = require('./DiscordJS-EasyBuilder')
let modal = new Modal(title)
```
* `title <string>`｜模態的標題

## addTextInput()
```js
.addTextInput(data) //添加TextInput
```
* `data <object>`｜TextInput的資料
```js
//TextInput接受的資料
{
  customId, //TextInput的自定義ID (必要參數)
  label, //TextInput的標題
  style, //TextInput的類型 (short, paragraph)
  minLength, //文字的最短長度
  maxLength, //文字的最長長度
  value, //TextInput預設的文字
  placeholder //在TextInput未輸入任何文字顯示的文字
}
```

## showModal()
```js
.showModal(interaction, callback, options) //顯示Modal
```
* `interaction`｜要用來顯示Modal的Interaction
* `callback <function>`｜提交Modal後觸發的函數，會帶有一個allInput的參數
* `options <object>`｜collector的選項

```js
//預設的options
{
  filter: i => i.user.id === interaction.user.id && i.customId === this._customId, 
  time: 600000,
  max: 1
}

//範例
new Modal('輸入文字')
  .addTextInput({
    customId: 'input1',
    label: '輸入1',
    style: 'short'
  })
  .showModal(interaction, (allInput) => {
    console.log(allInput.input1)
  })
```

# Embed顏色
```js
//可用的顏色
[
  black
  white,
  gray
  darkGray
  lightGray,
  red,
  darkRed,
  orange,
  darkOrange,
  yellow,
  green
  darkGreen
  blue
  darkBlue
  purple,
  darkPurple
]
```
