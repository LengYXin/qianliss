import { Image, Text, View } from '@tarojs/components';
import { observer } from '@tarojs/mobx';
import Taro, { Component } from '@tarojs/taro';
import { AtSearchBar } from 'taro-ui';
import 'taro-ui/dist/weapp/css/index.css';
import img from '../../../img/dizhi.png';
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
  onChange(e) {
    CommodityStore.onSetSearchBar(e);
  }
  onActionClick() {
    CommodityStore.onSearch()
  }
  onConfirm() {
    CommodityStore.onSearch()
  }
  render() {
    const searchBar = CommodityStore.searchBar;
    return (
      <View className='at-row at-search'>
        <View className='at-address'>
          <Image src={img} />
          <Text>柳州城中店</Text>
        </View>
        <View className='at-col'>
          <AtSearchBar className="search" value={searchBar}
            onChange={this.onChange.bind(this)}
            onConfirm={this.onConfirm.bind(this)}
            onActionClick={this.onActionClick.bind(this)}
          />
        </View>
      </View>
    )
  }
}

export default Index
