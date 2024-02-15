import React, { useState, useEffect, useRef, useContext } from 'react'
import { Table, Form, Input } from 'antd'
import axiosInstance from '../../../utils/index'

export default function RIghtList() {
  const [dataSource, setDataSource] = useState([])
  const EditableContext = React.createContext(null);

  useEffect(() => {
    const getData = async () => {
      await axiosInstance.get('/getcategories').then((res) => {
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
      title: '分類名',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '分類名',
        handleSave,
      }),
    }
  ]


  // 修改标题
  const handleSave = (item) => {
    if (item.title === dataSource[item.id - 1].title) return

    axiosInstance.patch(`/updatecategories/${item.id}`, {
      title: item.title,
      value: item.title
    }).then(() => {
      getData()
    })

  }

  const getData = () => {
    axiosInstance.get('/getcategories').then((res) => {
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
      <Table locale={{ emptyText: ' ' }} style={{ overflow: 'auto' }} dataSource={dataSource} columns={columns} pagination={{
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
