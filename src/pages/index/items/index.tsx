import { Image, Text, View, Navigator, Button } from '@tarojs/components';
import { observer } from '@tarojs/mobx';
import Taro, { Component } from '@tarojs/taro';
import { AtTag } from 'taro-ui';
import Loading from '../../../components/loading';
import { CommodityStore, ShoppingStore } from '../../../store';
import './index.less';
@observer
class Index extends Component {
  componentWillReact() {
  }
  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  onSetShopping(data, event) {
    event.stopPropagation()
    event.preventDefault()
    if (data.id) {
      ShoppingStore.onSetShopping(data)
    } else {
      Taro.showToast({ title: "商品信息出错", icon: "none" })
    }
  }
  render() {
    const PagingData = [...CommodityStore.Paging.PagingData];
    const loadingVis = CommodityStore.Paging.PagingLoading;
    return (
      <View>
        <View className="items">
          {PagingData.map(data => {
            const price = parseFloat(data.price).toFixed(2)
            const origPrice = parseFloat(data.origPrice).toFixed(2)
            const tag = CommodityStore.onGetTabText(data.categoryId);
            return <Navigator url={'/pages/details/index?id=' + data.id} key={data.id}>
              <View className="item">
                <View className="img">
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
                    <AtTag size='small'>{tag}</AtTag><Text className='stock-count'>(库存{data.stock && data.stock.count})</Text>
                    <View className="shopping-btn">
                      <Button onClick={this.onSetShopping.bind(this, data)}>加入购物车</Button>
                    </View>
                  </View>
                </View>
              </View>
            </Navigator>
          })}
        </View>
        <Loading visible={loadingVis} />
      </View>
    )
  }
}

export default Index
