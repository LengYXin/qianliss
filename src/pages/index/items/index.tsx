import { Image, Text, View, Navigator } from '@tarojs/components';
import { observer } from '@tarojs/mobx';
import Taro, { Component } from '@tarojs/taro';
import { AtTag } from 'taro-ui';
import Loading from '../../../components/loading';
import { CommodityStore } from '../../../store';
import './index.less';
@observer
class Index extends Component {
  componentWillReact() {
  }
  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
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
                    <AtTag size='small'>{tag}</AtTag>
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
