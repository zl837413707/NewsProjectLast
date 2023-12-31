import React, { useState, useEffect, useRef, useContext } from 'react'
import {
  DeleteOutlined, ExclamationCircleFilled, UserAddOutlined
} from '@ant-design/icons';
import { Table, Button, Modal, Form, Input } from 'antd'
import AxiosInstance from '../../../utils/axios'
const { confirm } = Modal;

export default function RIghtList() {
  const [dataSource, setDataSource] = useState([])
  const EditableContext = React.createContext(null);

  useEffect(() => {
    const getData = async () => {
      await AxiosInstance.get('/categories').then((res) => {
        console.log(res.data);
        setDataSource(res.data)
      })
    }
    getData()
  }, [])

  //表格数据
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '分类名',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '分类名',
        handleSave,
      }),
    }
  ]

  //弹出框方法
  const showConfirm = (item) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleFilled />,
      content: '確認ボタンを押すとデータは完全に削除されます、間違いがないかご確認ください',
      okText: '確認',
      cancelText: 'キャンセル',
      onOk() {
        okMethod(item)
      }
    });
  }
  //弹出框确认方法
  const okMethod = (item) => {
    // 判断是1级还是2级目录
    AxiosInstance.delete(`/categories/${item.id}`).then((res) => {
      const newData = dataSource.filter(data => data.id !== item.id)
      setDataSource(newData);
    })
  }

  // 修改标题
  const handleSave = (item) => {
    AxiosInstance.patch(`/categories/${item.id}`, {
      title: item.title,
      value: item.title
    }).then(() => {
      getData()
    })

  }

  const getData = () => {
    AxiosInstance.get('/categories').then((res) => {
      setDataSource(res.data)
    })
  }

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };

  return (
    <div>
      <Table style={{ overflow: 'auto' }} dataSource={dataSource} columns={columns} pagination={{
        pageSize: 6
      }} rowKey={item => item.id} components={{
        body: {
          row: EditableRow,
          cell: EditableCell,
        }
      }} />
    </div>
  )
}
