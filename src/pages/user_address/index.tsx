import { Image, Navigator, View } from '@tarojs/components';
import { observer } from '@tarojs/mobx';
import Taro, { Component, Config } from '@tarojs/taro';
import { AtList, AtListItem, AtSwipeAction } from 'taro-ui';
import edit from '../../img/edit.png';
import select from '../../img/select.png';
import { UserStore } from '../../store';
import './index.less';
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

  async componentDidShow() {
    Taro.showLoading({ title: "加载中", mask: true })
    await UserStore.onGetAddress()
    Taro.hideLoading()
  }

  componentDidHide() { }
  handleClick(e) {
    console.log(e)
  }
  state = {
    radio: 0,
    editBgColor: false,
    editIndex: 0
  }
  onClickRadio(num) {
    UserStore.onSetDefaultAddress(UserStore.address[num])
    this.forceUpdate();
  }
  onClickBgColor(num) {
    this.setState({
      editBgColor: !this.state.editBgColor,
      editIndex: num
    })
  }
  onAdd() {
    Taro.navigateTo({ url: '/pages/user_address/index?key=' })
  }
  render() {
    // const data = ["1", "2", "3", "4"]
    const { address, defaultAddress } = UserStore;
    return (
      <View className='address_edit'>
        <View className="edit-line"></View>
        {address.map((x, num) => {
          return <View key={num}>
            {/* <AtSwipeAction onClick={this.handleClick.bind(this, num)} onOpened={this.onClickBgColor.bind(this, num)} onClosed={this.onClickBgColor.bind(this, num)} options={[
              {
                text: '删除',
                style: {
                  backgroundColor: '#FF4949'
                }
              }
            ]}> */}
            <View className='edit-list'>
              <View className="list-left" onClick={this.onClickRadio.bind(this, num)}>
                {x.isDefault || defaultAddress.id == x.id ? <Image className='ridio-yes' src={select} /> : <View className="left-ridio"></View>}
                <View className="left-box">
                  <View className="box-name">{x.contactMan}<View className="phone">{x.contactPhone}</View></View>
                  <View className="box-add">{x.fullValue}</View>
                </View>
              </View>

              <View className={`list-right ${this.state.editBgColor && this.state.editIndex == num ? "right-color" : ""}`}>
                <Navigator url={`/pages/user_address_edit/index?key=${num}`}>
                  <Image className="right-img" src={edit} />
                </Navigator>
              </View>
            </View>

            {/* </AtSwipeAction> */}
            <View className="edit-line"></View>
          </View>
        })}
        <View className="plus">
          <AtList hasBorder={false} >
            <Navigator url="/pages/user_address_edit/index?key=-1">
              <AtListItem hasBorder={false} title='+新增收货地址' arrow='right' />
            </Navigator>
          </AtList>
        </View>
      </View>
    )
  }
}

export default Index
