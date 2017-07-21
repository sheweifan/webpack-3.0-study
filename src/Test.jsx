import React from 'react'
import ReactDOM from 'react-dom'
import { Button, Icon } from 'antd-mobile'


class Test extends React.Component{
	render(){
		return (
			<div>
				<Button className="test_btn">
					test hehe
					<Icon type="check" />
				</Button>
			</div>
		)
	}
}

export default Test;