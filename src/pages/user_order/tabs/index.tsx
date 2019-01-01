import { observer } from '@tarojs/mobx';
import Taro, { Component } from '@tarojs/taro';
import { AtTabs } from 'taro-ui';
import { OrderStore } from '../../../store';
import './index.less';
@observer
class Index extends Component {
  componentWillReact() {
  }
  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  onClick(current) {
    OrderStore.onSetCurrent(current);
  }
  render() {
    const tabList = [...OrderStore.typeList]
    const current = OrderStore.current;
    return (
      <AtTabs
        current={current}
        scroll
        swipeable={false}
        tabList={tabList}
        onClick={this.onClick.bind(this)}>
      </AtTabs>
    )
  }
}

export default Index
