import React from 'react';
import { Text, View,ListView } from 'react-native';
import { Card, WhiteSpace, WingBlank,Button,List,Switch,Toast,Modal} from 'antd-mobile-rn';
import axios from 'axios';
import qs from 'qs';

const Item = List.Item;
const Brief = Item.Brief;


//sensor列表的每一个最小单位
class NozzleItem extends React.Component{
    constructor(props:any){
        super(props);
        this.state={
            checked:this.props.data.nozzleState===1,
            positionX:this.props.data.positionX,
            positionY:this.props.data.positionY,
            nozzleId:this.props.data.nozzleId,
            radius:this.props.data.radius,
            visible:false
        };
    }

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    // componentDidMount(){
    //     if(this.props.data.sensorState===1)
    //         this.setState({checked:true});
    //     this.setState({positionX:this.props.data.positionX,
    //         positionY:this.props.data.positionY,
    //         sensorId:this.props.data.sensorId,});
    // }
    //
    // componentWillReceiveProps(nextProps){
    //     this.setState({
    //         checked:nextProps.data.sensorState===1,
    //         positionX:nextProps.data.positionX,
    //         positionY:nextProps.data.positionY,
    //         sensorId:nextProps.data.sensorId,
    //         visible:false
    //     })
    // }

    onSwitchChanged=() => {
        let tmpState = 0;
        if (this.state.checked === false) {
            tmpState = 1;
        }
        this.setState({checked: !this.state.checked});

        const params = {
            nozzleId: this.state.nozzleId,
            state: tmpState
        };
        axios.post('http://192.168.56.1:8080/nozzles/modifyStateByNozzleId', qs.stringify(params))
            .catch(()=>
            {
                Toast.fail("unable to change the state");
            })
    };

    onModifyPosition=(positionX,positionY)=>{
        this.setState({positionX:positionX,positionY:positionY})
    };
    onModifyRadius=(radius)=>{
        this.setState({radius:radius})
    }

    onButtonClick = () => {
        Modal.alert('Delete this nozzle?', 'the operation cannot be recovered', [
            { text: 'Cancel', onPress: () => console.log('cancel'), style: 'cancel' },
            {
                text: 'OK', onPress: () => {
                    console.log(this.state.nozzleId);
                    const params = {
                        nozzleId: this.state.nozzleId
                    };
                    axios.post('http://192.168.56.1:8080/nozzles/deleteNozzleByNozzleId', qs.stringify(params))
                        .then(() => {
                            Toast.info('successfully delete');
                            this.props.onDeleteNozzle();
                        });
                }
            }

        ]);
    };

    render(){
        return  <Card>
            <Card.Body>
                <List>
                    <Item extra={this.state.nozzleId} arrow={'empty'}>
                        nozzle id
                    </Item>
                    <Item extra={this.state.radius}
                          arrow={'horizontal'}
                          onClick={()=>{
                              //todo
                              this.props.navigation.navigate('ModifyNozzleRadius',
                                  {
                                      navigation: this.props.navigation,
                                      radius:this.state.radius,
                                      nozzleId:this.state.nozzleId,
                                      onModifyRadius:this.onModifyRadius.bind(this)
                                  })
                          }}
                        >
                        radius
                    </Item>
                    <Item extra={'('+this.state.positionX+','+this.state.positionY+')'}
                          arrow={'horizontal'}
                          onClick={()=>{
                              this.props.navigation.navigate('ModifyNozzlePosition',
                                  {
                                      navigation: this.props.navigation,
                                      positionX:this.state.positionX,
                                      positionY:this.state.positionY,
                                      nozzleId:this.state.nozzleId,
                                      onModifyPosition:this.onModifyPosition.bind(this)
                                  })
                          }}>
                        position
                    </Item>
                    <Item arrow={'horizontal'} onClick={()=>{
                        //todo 此处应该是跳转到每个传感器的实时数据界面
                    }}>
                        view data
                    </Item>
                    <Item extra={
                        <Switch
                            checked ={this.state.checked}
                            onChange={this.onSwitchChanged}
                        />
                    }
                    >
                        On/Off
                    </Item>
                </List>
                <Button type={'warning'} onClick={()=>
                {
                    this.setState({ visible: true });
                    this.onButtonClick();
                }
                }>Delete this nozzle</Button>
            </Card.Body>
        </Card>

    }
}

export default NozzleItem;