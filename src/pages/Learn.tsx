import React from 'react'
import { Menu, Icon, Drawer, Col, Row } from 'antd'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import { LearnContent } from '../components/learn/LearnContent'

import * as actionCreators from '../redux/actions/index'
import { connect } from 'react-redux'
import { INode } from '../redux/types/learn'
import { CustomSpin } from '../components/Spin'

const { SubMenu } = Menu

const responsive = `(max-width: 822px)`

const DrawerMenu = styled.div`
  position: fixed;
  top: 72px;
  width: 41px;
  height: 40px;
  cursor: pointer;
  z-index: 10;
  text-align: center;
  line-height: 40px;
  font-size: 16px;
  display: none;
  justify-content: center;
  align-items: center;
  background: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  border-radius: 0 4px 4px 0;

  @media ${responsive} {
    display: flex;
  }
`
const SideMenu = (props: any) => {
  return (
    <div className={props.className}>
      <Menu
        theme="light"
        mode="inline"
        style={{ height: '100%', borderRight: 0 }}
        selectedKeys={[props.currentPath]}
      >
        <Menu.Item key={'/learn'}>
          <NavLink to={'/learn'} onClick={props.onClose}>
            <Icon type="home" theme="filled" />
            Welcome!
          </NavLink>
        </Menu.Item>
        {props.nodes.map((node: INode) => {
          return node.type === 'section' ? (
            <SubMenu key={node.name} title={node.name}>
              {node.articles!.map((sub_node: INode) => {
                return (
                  <Menu.Item
                    key={'/learn/' + sub_node.article_id}
                    onClick={() => props.onItemClick(sub_node)}
                  >
                    <NavLink
                      to={'/learn/' + sub_node.article_id}
                      onClick={props.onClose}
                    >
                      {sub_node.name}
                    </NavLink>
                  </Menu.Item>
                )
              })}
            </SubMenu>
          ) : (
            <Menu.Item
              key={'/learn/' + node.article_id}
              onClick={() => props.onItemClick(node)}
            >
              <NavLink to={'/learn/' + node.article_id}>{node.name}</NavLink>
            </Menu.Item>
          )
        })}
      </Menu>
    </div>
  )
}

class Learn extends React.Component<any> {
  state = { visible: false }
  componentDidMount() {
    this.props.onInitialLoad(this.props.match.params.article_id)
  }

  componentDidUpdate() {}

  showDrawer = () => {
    this.setState({
      visible: true
    })
  }

  onClose = () => {
    this.setState({
      visible: false
    })
  }

  onItemClick = (node: any) => {
    this.props.onChangeArticle(this.props.idMap.get(node.article_id))
  }

  render() {
    const currentPath = this.props.match.url
    const nodes = this.props.menu
    const article_id = this.props.match.params.article_id
    return this.props.menuStatus !== 'SUCCESS' ? (
      <CustomSpin />
    ) : (
      <React.Fragment>
        <DrawerMenu onClick={this.showDrawer}>
          <Icon type="menu" />
        </DrawerMenu>
        <Drawer
          placement="left"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ padding: '10px' }}
        >
          <SideMenu />
        </Drawer>

        <Row>
          <Col span={6}>
            <SideMenu
              currentPath={currentPath}
              onClose={this.onClose}
              nodes={nodes}
              onItemClick={this.onItemClick}
            />
          </Col>
          <Col span={2}></Col>
          <Col span={14}>
            {article_id ? (
              <LearnContent
                article_id={article_id}
                currentContentStatus={this.props.currentContentStatus}
                currentContent={this.props.currentContent}
              />
            ) : (
              <div>
                Welcome to Programming.in.th Tutorials, a comprehensive
                compilation of all the resources you need to succeed in learning
                algorithms, data structures and competitive programming!
              </div>
            )}
          </Col>
          <Col span={2}></Col>
        </Row>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    menu: state.learn.menu,
    menuStatus: state.learn.menuStatus,
    idMap: state.learn.idMap,
    currentContent: state.learn.currentContent,
    currentContentStatus: state.learn.currentContentStatus
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onInitialLoad: (article_id: string) => {
      dispatch(actionCreators.loadMenu(article_id))
    },
    onChangeArticle: (newArticle: INode) => {
      dispatch(actionCreators.loadContent(newArticle.url!))
    }
  }
}

export const LearnPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(Learn)
