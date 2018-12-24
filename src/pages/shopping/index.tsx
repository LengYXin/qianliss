import { Image, Navigator, Text, View, Button } from '@tarojs/components';
import { observer } from '@tarojs/mobx';
import Taro, { Component, Config } from '@tarojs/taro';
import { AtInputNumber, AtList, AtListItem, AtTag, AtSwipeAction, AtFloatLayout, AtRadio } from 'taro-ui';
import img from '../../img/select.png';
import { CommodityStore, ShoppingStore, UserStore } from '../../store';
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
    navigationBarTitleText: '购物车',
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
  onUpdateSelect(index) {
    ShoppingStore.onUpdateSelect(index)
  }
  onUpdateConut(index, count) {
    ShoppingStore.onUpdateCount(index, count)
  }
  onSelectAll(selectAll) {
    ShoppingStore.onUpdateSelectAll(!selectAll)
  }
  onDelete(index) {
    ShoppingStore.onDelete(index)
  }
  onSettlement() {
    if (!UserStore.isLogin) {
      return Taro.showToast({ title: "请先登陆", icon: "none" })
    }
    if (ShoppingStore.total <= 0) {
      return Taro.showToast({ title: "购物车没有商品", icon: "none" })
    }
    if (ShoppingStore.dataList.filter(x => x.select).length <= 0) {
      return Taro.showToast({ title: "未选择结算商品", icon: "none" })
    }
    ShoppingStore.onSettlement()
  }
  onCouponsChange(e) {

  }
  stopPropagation = (e) => {
    e.stopPropagation()
  }
  render() {
    const { isLogin } = UserStore;
    const dataList = [...ShoppingStore.dataList];
    const selectAll = ShoppingStore.selectAll;
    const totalPrice = ShoppingStore.totalPrice;
    const couponShow = ShoppingStore.couponShow;
    const couponList = [...ShoppingStore.couponList];
    const couponSelect = ShoppingStore.couponSelect;

    return (
      <View className='index'>
        <AtList>
          {isLogin ? <Navigator url="/pages/address/index">
            <AtListItem className="address-item" title={'收件人：'} arrow='right' />
          </Navigator> : <Navigator className="address-item" openType="switchTab" url="/pages/user/index">
              <AtListItem title='请登录' arrow='right' />
            </Navigator>}
        </AtList>
        {dataList.map((data, index) => {
          const price = parseFloat(data.price).toFixed(2)
          const origPrice = parseFloat(data.origPrice).toFixed(2)
          const tag = CommodityStore.onGetTabText(data.categoryId);
          return <AtSwipeAction onClick={this.onDelete.bind(this, index)} key={data.id} options={[
            {
              text: '删除',
              style: {
                backgroundColor: '#FF4545'
              }
            }
          ]}
          >
            <View className="item" onClick={this.onUpdateSelect.bind(this, index)}>
              <View className="select">
                <Image src={data.select ? img : ''} mode="aspectFill" />
              </View>
              <View className="thumbUrl">
                <Image src={data.thumbUrl} mode="aspectFill" />
              </View>
              <View className="data-info">
                <View className='data-name'>
                  {data.text}
                </View>
                <View className='data-price'>
                  <Text>￥{price} </Text> <Text className='origPrice'>￥{origPrice}</Text>
                </View>
                <View className="data-tag">
                  <AtTag size='small'>{tag}</AtTag>
                </View>
              </View>
              <View className="update-count" onClick={this.stopPropagation}>
                <AtInputNumber
                  className="input-number"
                  type="number"
                  min={1}
                  max={9999}
                  step={1}
                  value={data.count}
                  onChange={this.onUpdateConut.bind(this, index)}
                />
              </View>
            </View>
          </AtSwipeAction>
        })}
        <View className="btns" onClick={this.onSelectAll.bind(this, selectAll)}>
          <View className="select" >
            <Image src={selectAll ? img : ''} mode="aspectFill" /><Text>全选</Text>
          </View>
          <View className="price">
            <Text>合计</Text> <Text className="price">￥{totalPrice} </Text>
          </View>
          <View className="btn" onClick={this.stopPropagation}>
            <Button onClick={this.onSettlement.bind(this)}>去结算</Button>
          </View>
        </View>
        <AtFloatLayout
          isOpened={couponShow}
          title='选择优惠券'
        >
          <AtRadio
            options={couponList.map((x: any) => {
              return { label: x.text, desc: `金额：￥ ${x.amount.toFixed(2)}`, value: x.no }
            })}
            value={couponSelect}
            onClick={this.onCouponsChange.bind(this)}
          />
          <Button onClick={this.onSettlement.bind(this)}>结算</Button>
        </AtFloatLayout>
      </View>

    )
  }
}

export default Index
