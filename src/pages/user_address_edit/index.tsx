import { View, Image } from '@tarojs/components';
import { observer } from '@tarojs/mobx';
import Taro, { Component, Config } from '@tarojs/taro';
import './index.less';
import { AtSwipeAction } from 'taro-ui';
import edit from '../../img/edit.png'
import select from '../../img/select.png'
@observer
class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '千里首铺',
    // 下拉刷新
    // enablePullDownRefresh: true,
    // backgroundTextStyle: "dark"
  }
  componentWillMount() {
  }
  componentWillReact() {
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  handleClick(e) {
    console.log(e._relatedInfo.anchorTargetText)
  }
  state = {
    radio: 0,
    editBgColor: false,
    editIndex: 0
  }
  async onClickRadio(e,num) {
    console.log(num)
    this.setState({
      radio: num
    })
  }
  async onClickBgColor(e,num) {
    console.log(num)
    this.setState({
      editBgColor: !this.state.editBgColor,
      editIndex: num
    })
  }
  render() {
    const data = ["1", "2", "3", "4"]
    return (
      <View className='address_edit'>
        <View className="edit-line"></View>
        {data.map((x, num) => {
          return <View key={num}>
            <AtSwipeAction  onOpened={this.onClickBgColor.bind(this, num)} onClosed={this.onClickBgColor.bind(this, num)} onClick={this.handleClick.bind(this,num)} options={[
              {
                text: '删除',
                style: {
                  backgroundColor: '#FF4949'
                }
              }
            ]}>
              <View className='edit-list'>
                <View onClick={this.onClickRadio.bind(this,num)} className="list-left">
                  {this.state.radio == num ? <Image className='ridio-yes' src={select} /> : <View className="left-ridio"></View>}
                  <View className="left-box">
                    <View className="box-name">名字<View className="phone">188888888888</View></View>
                    <View className="box-add">北京市朝阳区三元桥曙光西里甲10号无界空间曙光西里甲10号无界空间</View>
                  </View>
                </View>
                <View className={`list-right ${this.state.editBgColor && this.state.editIndex == num ? "right-color" : ""}`}>
                  <Image className="right-img" src={edit} />
                </View>
              </View>
            </AtSwipeAction>
            <View className="edit-line"></View>
          </View>
        })}
      </View>
    )
  }
}

export default Index
