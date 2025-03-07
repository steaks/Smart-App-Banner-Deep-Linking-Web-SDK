# Global





___

### setDebug(debug)

**Parameters**

**debug**: `boolean`, _required_ - Set the SDK debug flag.

Setting the SDK debug flag will generate a new device ID each time the app is installed
instead of possibly using the same device id.  This is useful when testing.

This needs to be set before the Branch.init call!!!

THIS METHOD IS CURRENTLY ONLY AVAILABLE IN THE CORDOVA/PHONEGAP PLUGIN

___



### init(branch_key, options, callback)

**Parameters**

**branch_key**: `string`, _required_ - Your Branch [live key](http://dashboard.branch.io/settings), or (depreciated) your app id.

**options**: `Object`, _optional_ - { *isReferrable*: _Is this a referrable session_ }.

**callback**: `function`, _optional_ - callback to read the session data.

THE "isReferrable" OPTION IS ONLY USED IN THE CORDOVA/PHONEGAP PLUGIN

Adding the Branch script to your page automatically creates a window.branch
object with all the external methods described below. All calls made to
Branch methods are stored in a queue, so even if the SDK is not fully
instantiated, calls made to it will be queued in the order they were
originally called.
If the session was opened from a referring link, `data()` will also return the referring link click as `referring_link`, which gives you the ability to continue the click flow.

The init function on the Branch object initiates the Branch session and
creates a new user session, if it doesn't already exist, in
`sessionStorage`.

**Useful Tip**: The init function returns a data object where you can read
the link the user was referred by.

##### Usage
```js
branch.init(
    branch_key,
    options
    callback (err, data),
);
```

##### Callback Format
```js
callback(
     "Error message",
     {
          data_parsed:        { },                          // If the user was referred from a link, and the link has associated data, the data is passed in here.
          referring_identity: '12345',                      // If the user was referred from a link, and the link was created by a user with an identity, that identity is here.
          has_app:            true,                         // Does the user have the app installed already?
          identity:           'BranchUser',                 // Unique string that identifies the user
          referring_link:          'https://bnc.lt/c/jgg75-Gjd3' // The referring link click, if available.
     }
);
```

**Note:** `Branch.init` must be called prior to calling any other Branch functions.
___



### data(callback)

**Parameters**

**callback**: `function`, _optional_ - callback to read the session data.

Returns the same session information and any referring data, as
`Branch.init`, but does not require the `app_id`. This is meant to be called
after `Branch.init` has been called if you need the session information at a
later point.
If the Branch session has already been initialized, the callback will return
immediately, otherwise, it will return once Branch has been initialized.
___



### first(callback)

**Parameters**

**callback**: `function`, _optional_ - callback to read the session data.

Returns the same session information and any referring data, as
`Branch.init` did when the app was first installed. This is meant to be called
after `Branch.init` has been called if you need the first session information at a
later point.
If the Branch session has already been initialized, the callback will return
immediately, otherwise, it will return once Branch has been initialized.

THIS METHOD IS CURRENTLY ONLY AVAILABLE IN THE CORDOVA/PHONEGAP PLUGIN

___



### setIdentity(identity, callback)

**Parameters**

**identity**: `string`, _required_ - a string uniquely identifying the user – often a user ID or email address.

**callback**: `function`, _optional_ - callback that returns the user's Branch identity id and unique link.

**[Formerly `identify()`](CHANGELOG.md)**

Sets the identity of a user and returns the data. To use this function, pass
a unique string that identifies the user - this could be an email address,
UUID, Facebook ID, etc.

##### Usage
```js
branch.setIdentity(
    identity,
    callback (err, data)
);
```

##### Callback Format
```js
callback(
     "Error message",
     {
          identity_id:             '12345', // Server-generated ID of the user identity, stored in `sessionStorage`.
          link:                    'url',   // New link to use (replaces old stored link), stored in `sessionStorage`.
          referring_data_parsed:    { },      // Returns the initial referring data for this identity, if exists, as a parsed object.
          referring_identity:      '12345'  // Returns the initial referring identity for this identity, if exists.
     }
);
```
___



### logout(callback)

**Parameters**

**callback**: `function`, _optional_

Logs out the current session, replaces session IDs and identity IDs.

##### Usage
```js
branch.logout(
    callback (err)
);
```

##### Callback Format
```js
callback(
     "Error message"
);
```
___



### close(callback)

**Parameters**

**callback**: `function`, _optional_

Close the current session.

##### Usage
```js
branch.close(
    callback (err)
);
```

##### Callback Format
```js
callback(
     "Error message"
);
```

THIS METHOD IS CURRENTLY ONLY AVAILABLE IN THE CORDOVA/PHONEGAP PLUGIN

___

## Tracking events



### track(event, metadata, callback)

**Parameters**

**event**: `string`, _required_ - name of the event to be tracked.

**metadata**: `Object`, _optional_ - object of event metadata.

**callback**: `function`, _optional_

This function allows you to track any event with supporting metadata. Use the events you track to create funnels in the Branch dashboard.
The `metadata` parameter is a formatted JSON object that can contain any data and has limitless hierarchy.

##### Usage
```js
branch.event(
    event,
    metadata,
    callback (err)
);
```

##### Callback Format
```js
callback("Error message");
```
___

# Deeplinking Methods

## Creating a deep linking link



### link(data, callback)

**Parameters**

**data**: `Object`, _required_ - link data and metadata.

**callback**: `function`, _required_ - returns a string of the Branch deep linking URL.

**[Formerly `createLink()`](CHANGELOG.md)**

Creates and returns a deep linking URL.  The `data` parameter can include an
object with optional data you would like to store, including Facebook
[Open Graph data](https://developers.facebook.com/docs/opengraph).

**data** The dictionary to embed with the link. Accessed as session or install parameters from the SDK.

**Note**
You can customize the Facebook OG tags of each URL if you want to dynamically share content by using the following optional keys in the data dictionary. Please use this [Facebook tool](https://developers.facebook.com/tools/debug/og/object) to debug your OG tags!

| Key | Value
| --- | ---
| "$og_title" | The title you'd like to appear for the link in social media
| "$og_description" | The description you'd like to appear for the link in social media
| "$og_image_url" | The URL for the image you'd like to appear for the link in social media
| "$og_video" | The URL for the video
| "$og_url" | The URL you'd like to appear
| "$og_redirect" | If you want to bypass our OG tags and use your own, use this key with the URL that contains your site's metadata.

Also, you can set custom redirection by inserting the following optional keys in the dictionary:

| Key | Value
| --- | ---
| "$desktop_url" | Where to send the user on a desktop or laptop. By default it is the Branch-hosted text-me service
| "$android_url" | The replacement URL for the Play Store to send the user if they don't have the app. _Only necessary if you want a mobile web splash_
| "$ios_url" | The replacement URL for the App Store to send the user if they don't have the app. _Only necessary if you want a mobile web splash_
| "$ipad_url" | Same as above but for iPad Store
| "$fire_url" | Same as above but for Amazon Fire Store
| "$blackberry_url" | Same as above but for Blackberry Store
| "$windows_phone_url" | Same as above but for Windows Store
| "$after_click_url" | When a user returns to the browser after going to the app, take them to this URL. _iOS only; Android coming soon_

You have the ability to control the direct deep linking of each link as well:

| Key | Value
| --- | ---
| "$deeplink_path" | The value of the deep link path that you'd like us to append to your URI. For example, you could specify "$deeplink_path": "radio/station/456" and we'll open the app with the URI "yourapp://radio/station/456?link_click_id=branch-identifier". This is primarily for supporting legacy deep linking infrastructure.
| "$always_deeplink" | true or false. (default is not to deep link first) This key can be specified to have our linking service force try to open the app, even if we're not sure the user has the app installed. If the app is not installed, we fall back to the respective app store or $platform_url key. By default, we only open the app if we've seen a user initiate a session in your app from a Branch link (has been cookied and deep linked by Branch).

#### Usage
```js
branch.link(
    data,
    callback (err, link)
);
```

#### Example
```js
branch.link({
    tags: [ 'tag1', 'tag2' ],
    channel: 'facebook',
    feature: 'dashboard',
    stage: 'new user',
    type: 1,
    data: {
        mydata: 'something',
        foo: 'bar',
        '$desktop_url': 'http://myappwebsite.com',
        '$ios_url': 'http://myappwebsite.com/ios',
        '$ipad_url': 'http://myappwebsite.com/ipad',
        '$android_url': 'http://myappwebsite.com/android',
        '$og_app_id': '12345',
        '$og_title': 'My App',
        '$og_description': 'My app\'s description.',
        '$og_image_url': 'http://myappwebsite.com/image.png'
    }
}, function(err, link) {
    console.log(err, link);
});
```

##### Callback Format
```js
callback(
    "Error message",
    'https://bnc.lt/l/3HZMytU-BW' // Branch deep linking URL
);
```



### sendSMS(phone, linkData, options, callback)

**Parameters**

**phone**: `string`, _required_ - phone number to send SMS to

**linkData**: `Object`, _required_ - object of link data

**options**: `Object`, _optional_ - options: make_new_link, which forces the creation of a new link even if one already exists

**callback**: `function`, _optional_ - Returns an error if unsuccessful

**[Formerly `SMSLink()`](CHANGELOG.md)**

A robust function to give your users the ability to share links via SMS. If
the user navigated to this page via a Branch link, `sendSMS` will send that
same link. Otherwise, it will create a new link with the data provided in
the `params` argument. `sendSMS` also  registers a click event with the
`channel` pre-filled with `'sms'` before sending an sms to the provided
`phone` parameter. This way the entire link click event is recorded starting
with the user sending an sms.

**Note**: `sendSMS` will *automatically* send a previously generated link click,
along with the `data` object in the original link. Therefore, it is unneccessary for the
`data()` method to be called to check for an already existing link. If a link already
exists, `sendSMS` will simply ignore the `data` object passed to it, and send the existing link.
If this behaivior is not desired, set `make_new_link: true` in the `options` object argument
of `sendSMS`, and `sendSMS` will always make a new link.

**Supports international SMS**.

#### Usage
```js
branch.sendSMS(
    phone,
    linkData,
    options,
    callback (err, data)
);
```

##### Example
```js
branch.sendSMS(
    phone: '9999999999',
    {
        tags: ['tag1', 'tag2'],
        channel: 'facebook',
        feature: 'dashboard',
        stage: 'new user',
        type: 1,
        data: {
            mydata: 'something',
            foo: 'bar',
            '$desktop_url': 'http://myappwebsite.com',
            '$ios_url': 'http://myappwebsite.com/ios',
            '$ipad_url': 'http://myappwebsite.com/ipad',
            '$android_url': 'http://myappwebsite.com/android',
            '$og_app_id': '12345',
            '$og_title': 'My App',
            '$og_description': 'My app\'s description.',
            '$og_image_url': 'http://myappwebsite.com/image.png'
        }
    },
    { make_new_link: true }, // Default: false. If set to true, sendSMS will generate a new link even if one already exists.
    function(err) { console.log(err); }
});
```

##### Callback Format
```js
callback("Error message");
```

___

# Referral system rewarding functionality
In a standard referral system, you have 2 parties: the original user and the invitee. Our system is flexible enough to handle rewards for all users for any actions. Here are a couple example scenarios:
1. Reward the original user for taking action (eg. inviting, purchasing, etc)
2. Reward the invitee for installing the app from the original user's referral link
3. Reward the original user when the invitee takes action (eg. give the original user credit when their the invitee buys something)

These reward definitions are created on the dashboard, under the 'Reward Rules' section in the 'Referrals' tab on the dashboard.

Warning: For a referral program, you should not use unique awards for custom events and redeem pre-identify call. This can allow users to cheat the system.

## Retrieve referrals list



### referrals(callback)

**Parameters**

**callback**: `function`, _required_ - returns an object with referral data.

**[Formerly `showReferrals()`](CHANGELOG.md)**

Retrieves a complete summary of the referrals the current user has made.

##### Usage
```js
branch.referrals(
    callback (err, data)
);
```

##### Callback Format
```js
callback(
    "Error message",
    {
        'install': {
             total: 5,
             unique: 2
        },
        'open': {
             total: 4,
             unique: 3
        },
        'buy': {
            total: 7,
            unique: 3
        }
    }
);
```

## Referral Codes



### getCode(options, callback)

**Parameters**

**options**: `Object`, _required_ - contins options for referral code creation.

**callback**: `function`, _optional_ - returns an error if unsuccessful

Create a referral code using the supplied parameters.  The code can be given to other users to enter.  Applying the code will add credits to the referrer, referree or both.
The `options` object can containt the following properties:

| Key | Value
| --- | ---
| amount | *reqruied* - An integer specifying the number of credits added when the code is applied.
| calculation_type | *required* - An integer of 1 for unlimited uses, or 0 for one use.
| location | *required* - An integer that etermines who get's the credits:  0 for the referree, 2 for the referring user or 3 for both.
| bucket | *optional* - The bucket to apply the credits to.  Defaults to "default".
| prefix | *optional* - A string to be prepended to the code.
| expiration | *optional* - A date string that if present, determines the date on which the code expires.

##### Usage

branch.getCode(
    options,
    callback(err,data)
);

##### Example

```js
branch.getCode(
    {
      "amount":10,
      "bucket":"party",
      "calculation_type":1,
      "location":2
    },
    callback (err, data)
);
```

##### Callback Format
```js
callback(
     "Error message",
     {
       "referral_code":"AB12CD"
     }
);
```

___



### validateCode(code, callback)

**Parameters**

**code**: `string`, _required_ - the code string to validate.

**callback**: `function`, _optional_ - returns an error if unsuccessful

Validate a referral code before using.

##### Usage

```js
branch.validateCode(
    code, // The code to validate
    callback (err)
);
```

##### Example

```js
branch.validateCode(
    "AB12CD",
    function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Code is valid");
        }
    }
);
```

##### Callback Format
```js
callback(
    "Error message",
    callback(err)
);
```

___



### applyCode(code, callback)

**Parameters**

**code**: `string`, _required_ - the code string to apply.

**callback**: `function`, _optional_ - returns an error if unsuccessful

Apply a referral code.

##### Usage

```js
branch.applyCode(
    code, // The code to apply
    callback (err)
);
```

##### Example

```js
branch.applyCode(
    "AB12CD",
    function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Code applied");
        }
    }
);
```

##### Callback Format
```js
callback(
    "Error message",
    callback(err)
);
```
___

## Credit Functions



### credits(callback)

**Parameters**

**callback**: `function`, _required_ - returns an object with credit data.

**[Formerly `showCredits()`](CHANGELOG.md)**

This call will retrieve the entire history of credits and redemptions from the individual user.

##### Usage
```js
branch.credits(
    callback (err, data)
);
```

##### Callback Format
```js
callback(
    "Error message",
    {
        'default': 15,
        'other bucket': 9
    }
);
```



### creditHistory(options, callback)

**Parameters**

**options**: `Object`, _optional_ - options controlling the returned history.

**callback**: `function`, _required_ - returns an array with credit history data.

This call will retrieve the entire history of credits and redemptions from the individual user.
Properties available in the `options` object:

| Key | Value
| --- | ---
| bucket | *optional (max 63 characters)* - The bucket from which to retrieve credit transactions.
| begin_after_id | *optional* - The credit transaction id of the last item in the previous retrieval. Retrieval will start from the transaction next to it. If none is specified, retrieval starts from the very beginning in the transaction history, depending on the order.
| length | *optional* - The number of credit transactions to retrieve. If none is specified, up to 100 credit transactions will be retrieved.
| direction | *optional* - The order of credit transactions to retrieve. If direction is `1`, retrieval is in least recent first order; If direction is `0`, or if none is specified, retrieval is in most recent first order.

##### Usage

```js
branch.creditHistory(
     options,
     callback(err, data)
);
```

##### Example

```js
branch.creditHistory(
    {
      "length":50,
      "direction":0,
      "begin_after_id":"123456789012345",
      "bucket":"default"
    }
    callback (err, data)
);
```

##### Callback Format
```js
callback(
    "Error message",
[
    {
        "transaction": {
                           "date": "2014-10-14T01:54:40.425Z",
                           "id": "50388077461373184",
                           "bucket": "default",
                           "type": 0,
                           "amount": 5
                       },
        "referrer": "12345678",
        "referree": null
    },
    {
        "transaction": {
                           "date": "2014-10-14T01:55:09.474Z",
                           "id": "50388199301710081",
                           "bucket": "default",
                           "type": 2,
                           "amount": -3
                       },
        "referrer": null,
        "referree": "12345678"
    }
]
);
```

___

## Credit redemption



### redeem(amount, bucket, callback)

**Parameters**

**amount**: `number`, _required_ - an `amount` (int) of number of credits to redeem

**bucket**: `string`, _required_ - the name of the `bucket` (string) of which bucket to redeem the credits from

**callback**: `function`, _optional_ - returns an error if unsuccessful

**[Formerly `redeemCredits()`](CHANGELOG.md)**

Credits are stored in `buckets`, which you can define as points, currency, whatever makes sense for your app. When you want to redeem credits, call this method with the number of points to be redeemed, and the bucket to redeem them from.

```js
branch.redeem(
    amount, // Amount of credits to be redeemed
    bucket,  // String of bucket name to redeem credits from
    callback (err)
);
```

##### Example

```js
branch.redeem(
    5,
    "Rubies",
    function(err) {
        console.log(err);
    }
);
```

##### Callback Format
```js
callback("Error message");
```
___

# Smart App Sharing Banner

The Branch Web SDK has a built in sharing banner, that automatically displays a device specific banner for desktop, iOS, and Android. If the banner is shown on a desktop, a form for sending yourself the download link via SMS is shown.
Otherwise, a button is shown that either says an "open" app phrase, or a "download" app phrase, based on whether or not the user has the app installed. Both of these phrases can be specified in the parameters when calling the banner function.
**Styling**: The banner automatically styles itself based on if it is being shown on the desktop, iOS, or Android.

# Customizing the App Sharing Banner

The app sharing banner includes a number of ways to easily customize it by specifying properties in the `options` object, which is the first argument of the banner.

### Your App's Information _required_
You can set the icon, title, and description for your app with the properties: `icon`, `title`, and `description`. For example, an app banner with these three properties set:
```js
branch.banner(
    {
         icon: 'http://icons.iconarchive.com/icons/wineass/ios7-redesign/512/Appstore-icon.png',
         title: 'Branch Demo App',
         description: 'The Branch demo app!'
    },
    {... link data ...}
);
```

### The Call To Action Text _optional_
On mobile devices, the app banner show's an option either to download the app if they do not have it installed, or open the app if they have already installed it. Both of these can be customized from their respective defaults of Download app, and View in app.
When the banner is opened on a desktop devide, a simpel form is shown that allows the user to txt themselves a link to the app. Both the placeholder phone number, and the text in the button can be customzied from their respective defaults of '(999) 999-9999' and 'Send Link'.
```js
branch.banner(
    {
         // required app info properties
         icon: 'http://icons.iconarchive.com/icons/wineass/ios7-redesign/512/Appstore-icon.png',
         title: 'Branch Demo App',
         description: 'The Branch demo app!',
         // Call to action customization
         openAppButtonText: 'Open',
         downloadAppButtonText: 'Install',
         phonePreviewText: '+44 9999-9999',
         sendLinkText: 'Txt me!'
    },
    {... link data ...}
);
```

### Enabed Platforms _optional_
The app banner detects the platform environment as either, desktop, iOS, or Android, and is enabled on all 3 by default. You can easily customize which platforms see the app banner as follows:
```js
branch.banner(
    {
         // required app info properties
         icon: 'http://icons.iconarchive.com/icons/wineass/ios7-redesign/512/Appstore-icon.png',
         title: 'Branch Demo App',
         description: 'The Branch demo app!',
         // Platforms customization
         showDesktop: false,
         showiOS: true,
         showAndroid: true
    },
    {... link data ...}
);
```

### Display Preferences _optional_
By default, the app banner displays inside of an iFrame (isolates the app banner css from your page), at the top of the page, shows a close button to the user, and will never show again once closed by the user. All of this functionality can be customized.
The `iframe` property defaults to true, and can be set to false if you wish for the banner HTML to display within your page. This allows you to customize the CSS of the banner, past what the Web SDK allows.
The `disableHide` property defaults to false, and when set to true, removes the close button on the banner.
The `forgetHide` property defaults to false, and when set to true, will forget if the user has opened the banner previously, and thus will always show the banner to them even if they have closed it in the past. It can also be set to an integer, in which case, it would forget that the user has previously hid the banner after X days.
The `position` property, defaults to 'top', but can also be set to 'bottom' if you would prefer to show the app banner from the bottom of the screen.
The `customCSS` property allows you to style the banner, even if it is isolated within an iframe. To assist you with device specific styles, the body element of the banner has one of three classes: `branch-banner-android`, `branch-banner-ios`, or `branch-banner-desktop`.
The `mobileSticky` property defaults to false, but can be set to true if you want the user to continue to see the app banner as they scroll.
The `desktopSticky` property defaults to true, but can be set to false if you want the user to only see the app banner when they are scrolled to the top of the page.
```js
branch.banner(
    {
         // required app info properties
         icon: 'http://icons.iconarchive.com/icons/wineass/ios7-redesign/512/Appstore-icon.png',
         title: 'Branch Demo App',
         description: 'The Branch demo app!',
         // Display preferences
         iframe: false,
         disableHide: true,
         forgetHide: true, // Can also be set to an integer. For example: 10, would forget that the user previously hid the banner after 10 days
         position: 'bottom',
         mobileSticky: true,
         desktopSticky: true,
         customCSS: '.title { color: #F00; }'
    },
    {... link data ...}
);
```

### Link Preferences _optional_
By default, tthe app banner will reusue a link that has most recently been created. If this is not desired, and you wish an enitrley new link to be created and overwrite the previous link, you can set `make_new_link` to true.
```js
branch.banner(
    {
         // required app info properties
         icon: 'http://icons.iconarchive.com/icons/wineass/ios7-redesign/512/Appstore-icon.png',
         title: 'Branch Demo App',
         description: 'The Branch demo app!',
         // Link preferences
         make_new_link: true
    },
    {... link data ...}
);
```

### Playing nicely with other positon fixed "sticky" banners
Do you already have a "sticky" element on the top of your website, such as a navigation bar? If so, the Branch app banner will likely interfere with it. Fortunatley, we have a solution!
Without any configuration, the Web SDK adds a class called `branch-banner-is-active` to the body element of your website when the banner opens, and removes it when the banner closes.
As an example, let's say you had an element on your website with a class of `header` that was `position: fixed;`. You could then add the following to your stylesheet:
```css
body.branch-banner-is-active .header { top: 76px; }
```
This will add exactly the space required to show the app banner above your navigation header!



### banner(options, data)

**Parameters**

**options**: `Object`, _required_ - object of all the options to setup the banner

**data**: `Object`, _required_ - object of all link data, same as Branch.link()

**[Formerly `appBanner()`](CHANGELOG.md)**

Display a smart banner directing the user to your app through a Branch referral link.  The `data` param is the exact same as in `branch.link()`.

| iOS Smart Banner | Android Smart Banner | Desktop Smart Banner |
|------------------|----------------------|----------------------|
| ![iOS Smart Banner](docs/images/ios-web-sdk-banner-1.0.0.png) | ![Android Smart Banner](docs/images/android-web-sdk-banner-1.0.0.png) | ![Desktop Smart Banner](docs/images/desktop-web-sdk-banner-1.0.0.png) |

THIS METHOD IS ONLY AVAILABLE IN THE WEB SDK NOT IN THE CORDOVA/PHONEGAP PLUGIN

#### Usage

```js
branch.banner(
    options, // Banner options: See example for all available options
    data // Data for link, same as Branch.link()
);
```

##### Example

```js
branch.banner({
    icon: 'http://icons.iconarchive.com/icons/wineass/ios7-redesign/512/Appstore-icon.png',
    title: 'Branch Demo App',
    description: 'The Branch demo app!',
    openAppButtonText: 'Open',              // Text to show on button if the user has the app installed
    downloadAppButtonText: 'Download',      // Text to show on button if the user does not have the app installed
    sendLinkText: 'Send Link',              // Text to show on desktop button to allow users to text themselves the app
    phonePreviewText: '+44 9999-9999',      // The default phone placeholder is a US format number, localize the placeholder number with a custom placeholder with this option
    showiOS: true,                          // Should the banner be shown on iOS devices?
    showAndroid: true,                      // Should the banner be shown on Android devices?
    showDesktop: true,                      // Should the banner be shown on desktop devices?
    iframe: true,                           // Show banner in an iframe, recomended to isolate Branch banner CSS
    disableHide: false,                     // Should the user have the ability to hide the banner? (show's X on left side)
    forgetHide: false,                      // Should we show the banner after the user closes it? Can be set to true, or an integer to show again after X days
    position: 'top',                        // Sets the position of the banner, options are: 'top' or 'bottom', and the default is 'top'
    mobileSticky: false,                    // Determines whether the mobile banner will be set `position: fixed;` (sticky) or `position: absolute;`, defaults to false *this property only applies when the banner position is 'top'
    desktopSticky: true,                    // Determines whether the desktop banner will be set `position: fixed;` (sticky) or `position: absolute;`, defaults to true *this property only applies when the banner position is 'top'
    customCSS: '.title { color: #F00; }',   // Add your own custom styles to the banner that load last, and are gauranteed to take precedence, even if you leave the banner in an iframe
    make_new_link: false                    // Should the banner create a new link, even if a link already exists?
}, {
    tags: ['tag1', 'tag2'],
    feature: 'dashboard',
    stage: 'new user',
    type: 1,
    data: {
        mydata: 'something',
        foo: 'bar',
        '$desktop_url': 'http://myappwebsite.com',
        '$ios_url': 'http://myappwebsite.com/ios',
        '$ipad_url': 'http://myappwebsite.com/ipad',
        '$android_url': 'http://myappwebsite.com/android',
        '$og_app_id': '12345',
        '$og_title': 'My App',
        '$og_description': 'My app\'s description.',
        '$og_image_url': 'http://myappwebsite.com/image.png'
    }
});
```
___

### closeBanner()

#### Closing the App Banner Programmatically

The App Banner includes a close button the user can click, but you may want to close the banner with a timeout, or via some
other user interaction with your web app. In this case, closing the banner is very simple by calling `Branch.closeBanner()`.

##### Usage
```js
branch.closeBanner();
```




___










