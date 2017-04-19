const React = require('react');
const ReactDOM = require('react-dom');

import { Form, Input, Select, Button ,TreeSelect,Radio,Checkbox, Upload, Icon, Modal} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
class RegistrationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: [],
            currentType: 0,
            radioValue: null,
            checkboxValue: null,
            previewVisible: false,
            previewImage: '',
            fileList: [],
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    componentDidMount() {
        var treeData = [];
        fetch('/admin/addQuestData', {
            credentials: 'same-origin'
        }).then((res)=>res.json()).then((data)=> {
            //修改data
            this.setState({
                type: data.data,
                stageB: data.data1,
                stageS: data.data2,
                treeData: []
            })
            data.data1.forEach((v, i)=> {
                let obj = {
                    label: v.name,
                    value: `f-${v.id}`,
                    key: `f-${v.id}`,
                    children: []
                }
                data.data2.forEach((val, index)=> {
                    if (val.s_id == v.id) {
                        let objSon = {
                            label: val.name,
                            value: `s-${val.id}`,
                            key: `s-${val.id}`
                        }
                        obj.children.push(objSon);
                    }
                })
                treeData.push(obj);
            })
            this.setState({
                treeData: treeData
            })
        });
        this.props.form.setFieldsValue({
            selectStage: this.state.value,
            uploadImg:this.state.fileList
        });
    }

    handleCancel() {
        this.setState({previewVisible: false})
    }

    handlePreview(file) {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange({ fileList }) {
        this.setState({fileList});
    }

    handleRemove(file) {
        var index=null;
        var fileList = this.state.fileList;
        fileList.forEach((v, i)=> {
            if (v.uid == file.uid) {
                index=i;
            }
        })
        let data = {index: index};
        fetch("/admin/removePicture", {
            method: "post",
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(data)
        }).then((res)=> {
            res.json()
        }).then((data)=> {

        })
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            fetch("/admin/addQue", {
                method: "post",
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify(values)
            }).then((res)=> res.json()).then((data)=> {
                if(data.code=="200"){
                    alert("添加试题成功!!!");
                    location.href = "/admin/addQuestion";
                }else{
                    alert("添加失败，请重新输入")
                }
            })
        });
    }

    onChange(value) {
        this.setState({value});
    }

    handleSelectChange(value) {
        this.setState({
            currentType: value
        })
    }

    handleRadioChange(e) {
        this.setState({
            radioValue: e.target.value,
        });
        this.props.form.setFieldsValue({
            answerRadio: this.state.radioValue
        });
    }

    handleCheckboxChange(checkedValues) {
        this.setState(
            {checkboxValue: checkedValues}
        );
        this.props.form.setFieldsValue({
            answerCheckbox: this.state.checkboxValue
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 6},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 14},
                sm: {span: 18},
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const tProps = {
            treeData: this.state.treeData,
            onChange: this.onChange,
            multiple: true,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: '请选择阶段'
        };
        const radioOption = [1, 2, 3, 4].map((v, i)=>(
            <FormItem
                {...formItemLayout}
                label={`选项${i+1}`}
                key={`radio-${i}`}
            >
                {getFieldDecorator(`option${i + 1}`)(
                    <Input />
                )}
            </FormItem>
        ))
        const checkboxOption = [1, 2, 3, 4, 5, 6, 7].map((v, i)=>(
            <FormItem
                {...formItemLayout}
                label={`选项${i+1}`}
                key={`checkbox-${i}`}
            >
                {getFieldDecorator(`option${i + 5}`)(
                    <Input />
                )}
            </FormItem>
        ))
        const plainOptions = [
            {label: 'A', value: 1},
            {label: 'B', value: 2},
            {label: 'C', value: 3},
            {label: 'D', value: 4},
            {label: 'E', value: 5},
            {label: 'F', value: 6},
            {label: 'G', value: 7},
        ]
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="试题描述"
                >
                    {getFieldDecorator('desc', {
                        rules: [
                            {required: true, message: '请输入试题描述'},
                        ],
                    })(
                        <Input type="textarea" rows={4}/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="上传图片"
                >
                    {getFieldDecorator('uploadImg', {
                        valuePropName: 'fileList'
                    })(
                        <div className="clearfix">
                            <Upload
                                action="/admin/addPicture"
                                listType="picture-card"
                                onPreview={this.handlePreview}
                                onChange={this.handleChange}
                                onRemove={this.handleRemove}
                            >
                                {uploadButton}
                            </Upload>
                            <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{ width: '100%' }} src={this.state.previewImage}/>
                            </Modal>
                        </div>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="选择题型"
                >
                    {getFieldDecorator('selectType', {
                        rules: [
                            {required: true, message: '请选择题型'},
                        ],
                        onChange: this.handleSelectChange,
                    })(
                        <Select placeholder="请选择题型">
                            {
                                this.state.type.map((v, i)=>(
                                    <Option value={`${v.id}`} key={`type-${v.id}`}>{v.name}</Option>))
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="选择阶段"
                >
                    {getFieldDecorator('selectStage', {
                        rules: [
                            {required: true, message: '请选择阶段'},
                        ],
                    })(
                        <TreeSelect {...tProps} />
                    )}
                </FormItem>
                {
                    this.state.currentType == 1 ? radioOption : ""
                }
                {
                    this.state.currentType == 2 ? checkboxOption : ""
                }
                {
                    this.state.currentType == 1 ?
                        <FormItem
                            {...formItemLayout}
                            label="试题答案"
                        >
                            {getFieldDecorator('answerRadio', {
                                rules: [
                                    {required: true, message: '请选择答案'},
                                ],
                            })(
                                <RadioGroup onChange={this.handleRadioChange}>
                                    <Radio value={1}>A</Radio>
                                    <Radio value={2}>B</Radio>
                                    <Radio value={3}>C</Radio>
                                    <Radio value={4}>D</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        : ""
                }
                {
                    this.state.currentType == 2 ?
                        <FormItem
                            {...formItemLayout}
                            label="试题答案"
                        >
                            {getFieldDecorator('answerCheckbox', {
                                rules: [
                                    {required: true, message: '请选择答案'},
                                ],
                            })(
                                <CheckboxGroup options={plainOptions} onChange={this.handleCheckboxChange}/>
                            )}
                        </FormItem>
                        : ""
                }
                {
                    this.state.currentType == 3 ?
                        <FormItem
                            {...formItemLayout}
                            label="试题答案"
                        >
                            {getFieldDecorator('answer', {
                                rules: [
                                    {required: true, message: '请输入答案'},
                                ],
                            })(
                                <Input type="textarea" rows={4}/>
                            )}
                        </FormItem>
                        : ""
                }
                <FormItem
                    {...formItemLayout}
                    label="试题解析"
                >
                    {getFieldDecorator('analysis')(
                        <Input type="textarea" rows={4}/>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <div className="button">
                        <Button type="primary" htmlType="submit">提交</Button>
                        <Button>取消</Button>
                    </div>
                </FormItem>
            </Form>
        );
    }
}
const WrappedRegistrationForm = Form.create()(RegistrationForm);

class App extends React.Component {
    render() {
        return (
            <WrappedRegistrationForm />
        )
    }
}
ReactDOM.render(<App/>, document.querySelector('#page'));