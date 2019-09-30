import * as React from 'react';
import { NavLink } from 'react-router-dom';

import { Else, If, Then } from '@anissoft/react-helpers/components/If';
import useRouter from '@anissoft/react-helpers/hooks/useRouter';
import Badge from '@material-ui/core/Badge';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import { ExpandLess, ExpandMore, MoreVert as More } from '@material-ui/icons';

import useStyles from './styles';

const LinkItem = React.forwardRef(({
  id,
  path,
  icon,
  caption,
  disabled,
}: {
  id: string;
  path: string;
  icon: React.ReactElement;
  caption: string;
} & ListItemProps,
ref: React.Ref<NavLink>) => {
  const classes = useStyles({});
  return (
    <ListItem
      disabled={disabled}
      key={id}
      to={path}
      component={NavLink}
      className={classes.item}
      activeClassName="selected"
      button
      ref={ref}
    >
      <Tooltip title={caption}>
        <ListItemIcon>{icon}</ListItemIcon>
      </Tooltip>
      <ListItemText primary={caption} />
    </ListItem>
  );
});

const MenuList = ({
  items: menuItems,
  allowedOperations,
  onChange,
}: {
  items: any[];
  allowedOperations?: string[];
  onChange?: (id: string) => void;
}) => {
  const [items, setItems] = React.useState(menuItems);
  const classes = useStyles({});
  const { location } = useRouter();

  function toggle(_id: string, silent: boolean = false) {
    if (onChange && !silent) {
      onChange(_id);
    }
    items.forEach((item) => {
      if (item.id === _id) {
        // eslint-disable-next-line no-param-reassign
        item.expanded = !item.expanded;
      } else {
        // eslint-disable-next-line no-param-reassign
        item.expanded = false;
      }
    });
    setItems([...items]);
  }

  React.useEffect(
    () => {
      let currentItem = items.find(({ path }) => location.pathname.indexOf(path) === 0);
      if (currentItem) {
        toggle(currentItem.id, true);
      } else {
        items.forEach(({ id, subs }) => {
          if (subs) {
            currentItem = (subs as any[]).find(({ path }) => location.pathname.indexOf(path) === 0);
            if (currentItem) {
              toggle(id, true);
            }
          }
        });
      }
    },
    [],
  );

  return (
    <List className={classes.list}>
      {items.filter(({ checkAccess }) => (checkAccess ? checkAccess(allowedOperations || []) : true))
        .map(({ id, caption, icon, path, subs, expanded, View }, index) => (
          <If key={`${id}-${index}`} condition={id === 'divider'}>
            <Then>
              <Divider key={`${id}-${index}`} />
            </Then>
            <Else>
              <If condition={!subs} key={id}>
                <Then>
                  <LinkItem {...{ id, caption, icon, path }} disabled={!View} />
                </Then>
                <Else>
                  {() => (
                    <>
                      <ListItem
                        selected={expanded}
                        key={id}
                        button
                        onClick={() => {toggle.bind(null, id)}}
                        // onClick={toggle.bind(null, id)}
                      >
                        <Tooltip title={caption}>
                          <ListItemIcon>
                            <Badge badgeContent="⋯">
                              {icon}
                            </Badge>
                          </ListItemIcon>
                        </Tooltip>
                        <ListItemText primary={caption} />
                        {expanded ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Collapse
                        key={`${id}-subs`}
                        in={!!expanded}
                        timeout="auto"
                        unmountOnExit
                      >
                        <MenuList items={subs as any} allowedOperations={allowedOperations} />
                      </Collapse>
                    </>
                  )}
                </Else>
              </If>
            </Else>
          </If>
        ))}
    </List>
  );
};

export default MenuList;
