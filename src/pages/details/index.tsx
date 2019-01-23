import { Image, Swiper, SwiperItem, Text, View, Button, Navigator } from '@tarojs/components';
import { observer } from '@tarojs/mobx';
import Taro, { Component, Config } from '@tarojs/taro';
import { AtTag } from 'taro-ui';
import 'taro-ui/dist/weapp/css/index.css';
import { CommodityStore, ShoppingStore } from '../../store';
import img from '../../img/che.png';
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
    Taro.showLoading({ title: "加载中", mask: true })
  }
  componentWillReact() {
  }

  async componentDidMount() {
    Taro.showShareMenu({ withShareTicket: true })
    await CommodityStore.onGetSkuDetail(this.$router.params.id);
    Taro.hideLoading()
  }

  componentWillUnmount() {
    CommodityStore.onSetDatails({})
  }

  componentDidShow() { }

  componentDidHide() { }
  onSetShopping() {
    const { details } = CommodityStore;
    if (details.id) {
      ShoppingStore.onSetShopping(details)
    } else {
      Taro.showToast({ title: "商品信息出错", icon: "none" })
    }
  }
  render() {
    const { details } = CommodityStore;
    let { text, price, origPrice, description, categoryText, thumbUrl, categoryId,stock} = details;
    const { total } = ShoppingStore;
    const tag = CommodityStore.onGetTabText(categoryId);
    price = parseFloat(price).toFixed(2);
    origPrice = parseFloat(origPrice).toFixed(2);
    return (
      <View className='details' >
        <Swiper
          className="Swiper"
          indicatorColor='#999'
          indicatorActiveColor='#333'
          // vertical
          circular
          indicatorDots
          autoplay
        >
          <SwiperItem className="SwiperItem" itemId="1">
            <Image
              src={thumbUrl} mode="aspectFill"
            />
          </SwiperItem>
        </Swiper>
        <View className="at-row">
          <View className="at-col row-text">
            <Text>{text}</Text> <AtTag size='small'>{tag}</AtTag>
            <View className="stock-count">(库存{stock && stock.count})</View> 
          </View>
          <View className="at-col row-price">
            <View className="price">￥{price} </View>
            <View className="origPrice">￥{origPrice}</View>
          </View>
        </View>
        <View className="border"></View>
        <View className='description'>
          <View className="description-title">描述：</View>
          <View className="description-text">
            {description}
          </View>
        </View>
        <View className="shopping">
          <Navigator url="/pages/shopping/index" open-type="switchTab">
            <View className="shopping-conut">
              <View>{total}</View>
              <Image
                src={img} mode="aspectFill"
              />
            </View>
          </Navigator>
          <View className="shopping-btn">
            <Button onClick={this.onSetShopping.bind(this)}>加入购物车</Button>
          </View>
        </View>
      </View>
    )
  }
}

export default Index
