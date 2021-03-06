import * as React from "react"

import { DropdownBordered } from "app/renderer/ui/components/dropdown"

const styles = require("./style.scss")

export interface Iprops {
  className?: string
  title?: string
  caption?: string
  actions?: Array<({ text: any; onClick: any })>
  contentClassName?: string
  empty?: boolean
}

/**
 * Wrapper UI component
 *
 * @export
 * @class Wrapper
 * @extends {React.Component<Iprops>}
 */

export default class Wrapper extends React.Component<Iprops> {

  // tslint:disable-next-line: completed-docs
  public render() {
    const contentStyles = `${!this.props.empty ? styles.content : styles.empty}
    ${this.props.contentClassName}`
    const actions = this.props.actions &&
      !this.props.empty &&
      (<DropdownBordered className={styles.actions} dataSource={this.props.actions} />)

    return (
      <div className={`${styles.layout} ${this.props.className}`}>
        <div className={styles.header}>
          <p className={styles.title}>{this.props.title}</p>
          {!this.props.empty && <p className={styles.caption}>{this.props.caption}</p>}
          {actions}
        </div>
        <div
          className={contentStyles}
        >
          {this.props.children}
        </div>
      </div>
    )
  }
}