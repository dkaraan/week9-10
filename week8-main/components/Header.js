import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
  Button,
} from "@chakra-ui/react";

import { WarningIcon, HamburgerIcon, MinusIcon, AddIcon, UnlockIcon, UpDownIcon, LockIcon } from '@chakra-ui/icons';

import DarkModeSwitch from '/components/DarkModeSwitch';

import React from 'react'
import Link from 'next/link'

const nfaDependencyVersion =
  require('../package.json').dependencies['next-firebase-auth']
const nextDependencyVersion = require('../package.json').dependencies.next
const firebaseDependencyVersion =
  require('../package.json').dependencies.firebase

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
  },
  versionsContainer: {
    marginLeft: 16,
    marginRight: 'auto',
  },
  button: {
    marginLeft: 16,
    cursor: 'pointer',
  },
}

const Header = ({ email, signOut }) => (


  <div style={styles.container}>

    <div style={styles.container}>
      <Link href="/">
        Logo
      </Link>
    </div>

    <div style={styles.container}>
      <Link href="/todo">
        Todo
      </Link>
    </div>

    <div style={styles.container}>
      <Link href="/event">
        Events
      </Link>
    </div>

    <div style={styles.container}>
      <Link href="/contacts">
        Contacts
      </Link>
    </div>

    <div style={styles.versionsContainer}>


      <div>


      </div>
    </div>

    <DarkModeSwitch />

    <Menu>
      {({ isOpen }) => (
        <>

          <MenuButton isActive={isOpen} as={Button}>
            {isOpen ? <MinusIcon /> : <AddIcon />}
          </MenuButton>

          <MenuList>
            {email ? (//put in brackets due to there being morethan one line of html code in jsx
              <>
                <MenuOptionGroup defaultValue="asc" title={`Signed in as ${email}`} type="radio">
                  <MenuItem>
                    <button
                      type="button"
                      onClick={() => {
                        signOut()
                      }}
                      style={styles.button}
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </MenuOptionGroup>
              </>
            ) : //or statment for if auth email or not

              (
                <>
                  <MenuOptionGroup defaultValue="asc" title="You are not signed in" type="radio">
                    <MenuItem>
                      <Link href="/auth">
                        <a>
                          <button type="button" style={styles.button}>
                            Sign in
                          </button>
                        </a>
                      </Link>
                    </MenuItem>
                  </MenuOptionGroup>
                </>
              )}

          </MenuList>
        </>
      )}
    </Menu>

  </div>
)

export default Header
